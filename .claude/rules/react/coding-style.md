---
paths:
  - "apps/frontend/**/*.ts"
  - "apps/frontend/**/*.tsx"
---

# React/Next.js Coding Style

> This file extends [typescript/coding-style.md](../typescript/coding-style.md) with React/Next.js specific content.

## ⚠ このプロジェクトの絶対前提: データ取得は Client Component から

**Server Component で `await fetch()` / `await db.xxx()` 等のデータ取得を書かない。データ取得は必ず Client Component + React Query (orval が生成する `useXxx` hooks) で行う。**

理由: フロント / バック独立開発のため MSW (Service Worker) で API をモックしている。MSW はブラウザのネットワーク層に座るので、**サーバ側の Node.js プロセスから出る fetch は捕まえない**。Server Component で fetch すると本物のバックエンド (or 開発時は失敗) を叩きに行き、MSW モックが完全に無視される。

```tsx
// ✗ 禁止: Server Component で fetch (MSW を素通り → 本物の API or 失敗)
export default async function Page() {
  const res = await fetch("https://api.example.com/hello");
  const data = await res.json();
  return <div>{data.message}</div>;
}

// ✓ 必須: Client Component で生成 hooks を使う
("use client");
import { useGetHello } from "@/schema/api";
export default function Page() {
  const { data } = useGetHello();
  return <div>{data?.data.message}</div>;
}
```

Server Action / Route Handler 内の fetch も同じ理由で MSW 対象外。**バックエンド呼び出しは全て browser → MSW 経路に通す。**

## Server Components 優先 (データ取得しない範囲で)

データ取得を除いた **静的構造 / レイアウト / 型変換** などは Server Component で書く。`"use client"` はインタラクティブな leaf にだけ付ける。

理由: Server Component は JS バンドルに乗らない。`"use client"` を上に付けるほどその配下全部が client bundle に入って初期描画が重くなる。

### `"use client"` が必要な場合

以下のどれかを使うときだけ付ける:

- `useState` / `useReducer` / `useEffect` / `useRef` などの hooks
- `useQuery` / `useMutation` などの React Query hooks (= 生成された `useGetXxx` 全部)
- `onClick` / `onChange` などのイベントハンドラ
- `localStorage` / `window` などブラウザ専用 API
- React Context Provider (`QueryClientProvider` 等)

それ以外 (props を受けて JSX を返すだけ、サーバ側の純粋な変換) は Server Component に保つ。

### アーキテクチャ: leaf に `"use client"` を切る

interactivity / データ取得が必要な小さな leaf に境界を切り、その親 (layout / page の枠 / セクションラッパ) は Server Component のまま保つ。

```tsx
// ✓ 良い: 枠は Server、データ取得 + interactivity の leaf だけ Client
// app/dashboard/page.tsx (Server Component)
import { HelloCard } from "./hello-card";
import { LikeButton } from "./like-button";

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <HelloCard />
      <LikeButton initialLikes={0} />
    </main>
  );
}

// app/dashboard/hello-card.tsx (Client Component, データ取得 leaf)
("use client");
import { useGetHello } from "@/schema/api";
export function HelloCard() {
  const { data, isLoading } = useGetHello();
  if (isLoading) return <p>Loading...</p>;
  return <p>{data?.data.message}</p>;
}

// app/dashboard/like-button.tsx (Client Component, interactivity leaf)
("use client");
import { useState } from "react";
export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  return <button onClick={() => setLikes(likes + 1)}>{likes}</button>;
}
```

```tsx
// ✗ 悪い: ページ全体を Client にしてしまう
"use client";
import { useGetHello } from "@/schema/api";
import { useState } from "react";

export default function DashboardPage() {
  const { data } = useGetHello();
  const [likes, setLikes] = useState(0);
  return (
    <main>
      <h1>Dashboard</h1>
      <p>{data?.data.message}</p>
      <button onClick={() => setLikes(likes + 1)}>{likes}</button>
    </main>
  );
  // ↑ <h1> は静的なのに Client bundle に入っている
}
```

### Provider のような Context wrapper

`"use client"` を付ける必要があるが、layout からの呼び出し側は Server Component のまま保てる。combiner だけは Server で書ける。

```tsx
// ✓ 良い: provider.tsx は Server、各 Provider 内部は Client
// lib/provider.tsx (Server Component)
import { QueryProvider } from "./query-provider";
import { MswProvider } from "./msw-provider";
export function Provider({ children }) {
  return (
    <MswProvider>
      <QueryProvider>{children}</QueryProvider>
    </MswProvider>
  );
}

// lib/query-provider.tsx (Client Component)
("use client");
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// ...
```

## React Compiler 有効: 手動メモ化禁止

`next.config.ts` で `reactCompiler: true` 有効。**`useMemo` / `useCallback` / `React.memo` を新規に書かない。** コンパイラが自動で最適化する。

```tsx
// ✓ 良い: 素直に書く
function Component({ items, sortBy }: Props) {
  const sorted = [...items].sort((a, b) => a[sortBy] - b[sortBy]);
  return <List items={sorted} />;
}

// ✗ 悪い: 手動メモ化 (Compiler が同等以上にやる)
function Component({ items, sortBy }: Props) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a[sortBy] - b[sortBy]),
    [items, sortBy],
  );
  return <List items={sorted} />;
}
```

```tsx
// ✗ 悪い: useCallback で関数を握る
const handleClick = useCallback(() => doSomething(id), [id]);

// ✓ 良い: そのまま
const handleClick = () => doSomething(id);
```

### Escape hatch (例外的に使って良いケース)

`useEffect` の依存配列で **参照同一性を保たないと無限ループが起きる場合のみ** 許容する:

```tsx
// useMemo を使ってよい唯一のケース: effect の dep stability
const config = useMemo(() => ({ url, headers }), [url, headers]);

useEffect(() => {
  subscribe(config);
}, [config]); // config が毎回新規参照だと毎レンダ subscribe してしまう
```

最初に「そもそもこの effect は必要か / config を ref に逃せないか」を検討する。React Compiler は既存の `useMemo` / `useCallback` を尊重して残すので escape hatch は壊れない。

### RHF の自作フィールドは `Controller` / `useController` で配線する（`watch` + `setValue` で代用しない）

React Hook Form で controlled な自作フィールド（独自コンポーネントに `value` / `onChange` を渡す類）を繋ぐときは、**`Controller` か `useController` を使う**。`useFormContext().watch(name)` で値を読み `setValue(name, ...)` で書く方式に**しない**。

理由: **React Compiler 有効下では、memo 化された子コンポーネントで `watch()` が `setValue` 時に再描画を駆動しない**。結果、`onChange` で RHF の値は更新されるのに **UI が再描画されず**、controlled な入力（checkbox 等）が「操作しても見た目が戻る＝無反応」になる。`Controller` / `useController` は購読機構（`useController` 内部の state）を持つので値変更で確実に再描画する。プロジェクトの `FormField`(=Controller) を使う既存 Select / 既存フォームの Checkbox はこの理由で正しく動いている。

```tsx
// WRONG: watch + setValue（React Compiler 下で再描画されず無反応に見える）
const { watch, setValue } = useFormContext<FormValues>();
const value = watch("items");
return <MyField value={value} onChange={(v) => setValue("items", v, { shouldDirty: true })} />;

// CORRECT: useController（Select / 既存 Checkbox と同じ購読機構）
const { control } = useFormContext<FormValues>();
const { field } = useController({ control, name: "items" });
return <MyField value={field.value ?? []} onChange={field.onChange} />;
```

**この種の再描画バグは Storybook では捕まらない**: Storybook の build は Next の React Compiler を適用しないため再現せず、かつ「送信値」を見るテストは `setValue` で値だけ更新されるので素通りする。**自作フィールドは dev 実機で「クリック→画面が反映される」まで確認する**（development-workflow.md の実機チェックリスト）。Storybook play では「操作後に選択状態が**画面に出る**」視覚アサートを入れて意図を固定する。

## コンポーネント構造

- **命名と分割**: ファイル・ディレクトリ名は `kebab-case`、React コンポーネント名は `PascalCase`。コンポーネント単位でファイルを分ける。

- **import 境界**: 外部 UI / 可視化ライブラリのコンポーネントを画面・機能側から直接 import せず、`src/components` 配下の共通中間層経由で使う。新しい外部コンポーネントを使う場合は、まず共通ラップコンポーネントを作成し、Story を書いてから使用する。

- **責務境界**: 共通コンポーネントへ追加してよい機能や設定は、複数の利用箇所で自然に説明できる汎用的な表示制御に限る。特定機能のデータ解釈・判定・加工は利用側または近接する純粋ロジックに置く。変更前に、既存責務との重複、利用側で解決できる可能性、過剰な抽象化や設定項目過多になっていないかを確認する。

- **純粋ロジック**: コンポーネント内にデータ変換・集計・判定などの純粋ロジックを置かない。近接する `.ts` ファイルに切り出し、コンポーネントは表示と状態接続に寄せる。ロジックのテストはその `.ts` ファイルの関数を直接対象にする。

- **フックの設計 (外部副作用と状態機械の分離)**: カスタムフックに **mock データ・`process.env` 分岐・動的 import (`await import`)・未テストの状態機械**を同居させない。
  - 外部副作用 (ブラウザ API / 外部 SDK / 録音・通信) は **interface (port) で抽象化して adapter を注入**する (フック第 2 引数の default や prop で差し込む)。本番 adapter は静的 import で 1 ファイルに閉じ、mock/fake adapter は **test / story / dev 選択層だけが import** する場所に隔離する (production ロジックにモック文字列を残さない)。
  - 状態遷移は **純粋 reducer (`(state, event) => state`)** に切り出す。vitest で全遷移を mock 無しで検証し、Storybook は fake adapter を注入して recording / error / loading 等の状態を play で駆動する (`renderHook` / testing-library を増やさない)。
  - 理由: モック・env 分岐・動的 import をフックに混ぜると「モックの本番バンドル混入・tree-shaking 阻害・状態機械がテスト不能」が同時に起きる。port/adapter + 純粋 reducer に割ると 3 つとも解ける。

## Story 内の hooks

- **Story でフック (`useState` 等) を使う場合は、必ず `decorators` 内で呼ぶ。**
- Story 関数や `render` の直接的なスコープでフックを呼ぶのは禁止。

## UI ポリシー

- **入力制限時のフィードバック**: ユーザーの操作を何らかの方法で制限する場合（入力フィルタリング、操作の無効化など）、なぜ制限されたのかユーザーにわかるように視覚的フィードバックを必ず提供すること

- **入力できそう感 (input affordance)**: 入力可能な要素は「何を入れるべきか」が見ただけで分かること
  - すべての `<input>` / `<textarea>` に **意味のある placeholder** を入れる（具体例 or フォーマットを示す。"〇〇を入力" のような自明な文言は禁止）
  - **パスワード入力には visibility toggle を必ず付ける**（eye / eye-off アイコンでの切替）。誤入力防止と aria-label を伴う

- **早期バリデーション**: 提出前に弾ける入力はクライアントで弾いてその場でエラーを表示する
  - フォーム実装は **React Hook Form + Zod (zodResolver)** で統一する。`@/components/ui/form` (shadcn) で `<FormField>` / `<FormMessage>` を使い、エラー文を入力欄直下に表示する
  - `FormLabel` / `FormControl` / `FormMessage` は **`<FormField>` の render-prop 内専用**（理由: 内部で `useFormField` を呼ぶため、外で使うと `useFormField should be used within <FormField>` で runtime throw。型では検出されない）。RHF 管理外の入力（useState で持つ file input 等）には plain `<Label>` (`@/components/ui/label`) を使う
  - 不要な submit ラウンドトリップを避け、フィールド単位で blur / change 時にバリデーション
  - サーバー側エラー（401 / 409 等）は Alert で別領域に表示し、フィールドエラーと混同しない

- **クリックできそう感 (click affordance)**: クリッカブルな要素は静止状態でも「押せる」と感じさせること
  - `cursor-pointer` を含む shadcn / カスタムコンポーネントを使う
  - hover 時には **背景色の変化 + 微小な動き** の両方を出す。例: `hover:-translate-y-px` / `hover:scale-[1.01]` 等。`transition-*` で滑らかに

- **クリックしたらどうなるか感 (action signaling)**: クリックの結果が予測できるよう、操作を象徴するアイコンを必須で添える
  - 進む系 CTA: `ArrowRight` / `ChevronRight`（"確認"・"次へ"・"登録して続行" 等）
  - 追加系: `Plus`（"新規作成"・"追加"）
  - 削除系: `Trash2`（"削除"）
  - 保存系: `Check`（"登録する"・"保存"）
  - 戻る系: `ArrowLeft` / `ChevronLeft`（"戻る"・"前へ"）
  - キャンセルなど受動的な行動は、誤誘導を避けるためアイコン無しで OK

- **行リンクの視覚誘導**: リスト行が詳細画面へのリンクである場合、右端に `ChevronRight` を必ず出す。hover で行全体に背景色変化を入れて「行ごとリンク」と分からせる

- **タイトル直下の永続説明文は default で書かない**: タイトル + 配下の要素 (フォーム / リスト / カード) で意味が伝わるなら、説明文は冗長。「スペースを埋めるため」の文章は禁止
  - 説明が必要に感じたら、まず **要素側を直す**: label / placeholder / セクション分割 / 適切な title 文言で自明にする
  - それでも残る補足は **`<i>` icon + tooltip** に逃がす (常時 visible にしない)
  - 永続描画が genuinely 必要な場面のみ説明文 OK: 空状態 / 不可逆操作の確認 modal / 初回オンボーディング (dismissable) / セクション内の業務固有手順説明

- **未実装の UI は明示する**: 動かない機能は **空状態 / 「未実装」バッジ / disabled + tooltip** のいずれかで明示する。検索 input・ボタン・タブが「あるように見えて反応しない」のは禁止

- **グローバル UI は app shell の `layout.tsx` に配置する**: ブランド / 認証ユーザー / テナント設定など認証スコープ全体に共通する要素は、認証スコープのルート `layout.tsx` に 1 度だけ書く。ページ単位の wrapper コンポーネントで包まない

- **技術メタ情報は業務シナリオで使う場面でのみ表示する**: `createdAt` / `updatedAt` / `version` などのレコードメタは、業務上判断に使う場面 (例: 最終更新からの経過日数で優先度を見る) でのみ出す

- **キーボードショートカット表示は platform-aware**: `<kbd>` で表示する修飾キーは macOS と Windows / Linux で別物。`⌘` / `⌥` / `⇧` は Mac 限定の Unicode 記号で、Win / Linux ユーザーには意味不明
  - macOS: `⌘ K` / `⌥ Click` / `⇧ Enter`
  - Windows・Linux: `Ctrl K` / `Alt Click` / `Shift Enter`
  - 検出: `navigator.userAgentData?.platform === "macOS"` を優先、fallback で `/Mac|iPhone|iPad/i.test(navigator.platform)`
  - SSR mismatch を避けるため **マウント後に `useEffect` で判定**。サーバー初回描画は kbd を hidden、client で hydrate 後に出す
  - 修飾キー bind 自体も同様: `event.metaKey` (mac) / `event.ctrlKey` (他) を分岐

## ローディング表示の選択基準

| パターン               | いつ使う                                                          | 理由                                                |
| ---------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| **スケルトン**         | レイアウトが予測できる（リスト、カード、テーブル）                | コンテンツの「形」が先に見えてCLS防止＋体感速度向上 |
| **インラインテキスト** | 小さな領域、レイアウトが不定（チャート、展開パネル内）            | 骨格を作る意味が薄い場合                            |
| **プログレスバー**     | 進捗が計測可能で3秒以上かかる（ファイルアップロード、バッチ処理） | 「あとどれくらい」が伝わる                          |
| **スピナー**           | ボタン押下後の短い待ち（保存、送信）                              | アクションの応答として                              |

判断フロー:

1. 進捗率がわかる → **プログレスバー**
2. レイアウト（形・サイズ）が事前に決まる → **スケルトン**
3. ユーザーのアクション起因 → **スピナー**（ボタン内 or インライン）
4. いずれでもない → **インラインテキスト**

チラつき防止: 200ms 未満の読み込みではローディング表示を出さない。

## エラーフィードバックの選択基準

mutation / API 呼び出しの失敗時は、**画面内 Alert (永続表示) と toast (短時間通知) の両方を必ず出す**。toast 単独依存は禁止。

| パターン         | 役割                                               | 必須性                              |
| ---------------- | -------------------------------------------------- | ----------------------------------- |
| **画面内 Alert** | エラー詳細をその場に永続表示                       | **必須**: 画面外でも残る            |
| **toast**        | 別画面遷移後でも気付ける短時間通知                 | 補助通知として併用                  |
| **field 直下**   | RHF + zod バリデーションのフィールド毎エラー       | 入力フォーム必須                    |

理由:
- toast 単独だと **3-5 秒で消える** ため、エラー内容を見直したいユーザーが追跡できない
- toast は Portal で DOM 別ツリーに出るため、Storybook の play function で assert しにくい
- Alert は `role="alert"` で a11y 担保 + 画面内に残るためテストでも検証しやすい

### retryable と fatal を出し分ける

一時的失敗 (LLM throttle / network 断) と契約違反 (4xx 仕様違反 / 5xx 恒久障害) は HTTP status と Alert variant で分岐する:

- retryable (HTTP 503 / network error) → `Alert variant="default"` + `toast.warning` + 「少し時間をおいて再試行してください」文言
- fatal (HTTP 500 / 4xx 仕様違反) → `Alert variant="destructive"` + `toast.error`

### backend の error 文字列を verbatim で UI に出さない

mutation / API 失敗時に、backend が返した `error` 文字列（`toApiErrorMessage()` の戻り値）を `Alert` / `toast` に**そのまま渡してはいけない**。HTTP status から**フロント著作の固定文言**にマップして出す。

理由: backend error は技術用語・内部識別子・スタック由来の文言を含み、エンドユーザーに読ませる前提で書かれていない（coding-style.md の「ユーザーの目に触れる文言で "LLM" を使わない」と同根）。status→固定文言マップなら文言を一元管理でき、表記ゆれと情報漏洩を同時に防げる。

```
NG: toast.error(toApiErrorMessage(err))            // backend 文言を素通し
NG: <Alert>{err.response.data.error}</Alert>
OK: toast.error(messageForStatus(err.status))      // 503→「…再試行」/ 4xx→「入力を確認」等の固定文言
```

詳細な status→文言マップと是正対象の洗い出しは `docs/error-message-passthrough-remediation.md`。

## hover 状態は「クリックできる要素」だけに付ける

hover で背景色・色が変わる要素は、ユーザーに「クリックできる」と読ませる affordance になる。**非インタラクティブな要素（status / 進捗 バッジ、ラベル、表示専用 chip）に hover 変化を付けてはいけない。**

具体的な踏み方: status 表示バッジを shadcn `Badge` の `variant="default"` で作ると `hover:bg-primary/80` が付き、クリック可能に見える（PO から繰り返し指摘）。

- 表示専用バッジは `variant="outline"`（または hover を持たない variant）を使い、色は status 配色を自前クラスで付ける
- クリックできない要素に `cursor-pointer` / `hover:bg-*` / `hover:text-*` を付けない
- 進捗・状態の系列（録画待ち / 解析中 / 解析済 / 失敗 等）は**文言だけでなく色で段階を区別**する（melta-ui の semantic status 配色を使う。3-Color Rule の範囲内）
