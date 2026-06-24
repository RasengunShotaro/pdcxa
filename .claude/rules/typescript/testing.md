---
paths:
  - "**/*.{test,spec}.{ts,tsx}"
  - "**/*.stories.{ts,tsx}"
---
# TypeScript/JavaScript Testing

> This file extends [common/testing.md](../common/testing.md) with TypeScript/JavaScript specific content.
> テストファイル (`*.test.ts(x)`, `*.spec.ts(x)`, `*.stories.ts(x)`) を書く時にロードされる。

## ペア命名規約

実装と同階層に同名でテストを置く:

- `src/foo.ts` ↔ `src/foo.test.ts`
- `src/foo.tsx` ↔ `src/foo.test.tsx`
- 既存の `.spec.ts(x)` も認める

## テストフレームワーク

**Vitest** を採用。`bun run test` で実行する。

- watch / run の切り替え不要（vitest が TTY を自動判別）
- 設定ファイル: backend は `vitest.config.ts` (node 環境)、frontend は `vitest.config.mts` (jsdom 環境)

---

# テストコード品質規約

## 1. AAA パターン

すべてのテストは **Arrange → Act → Assert** の3フェーズで書く。空行で視覚的に分離する (コメントは不要)。

- 1テスト内の Act は原則 **1回**。複数 Act が必要なら複数テストに分ける
- `beforeEach` はインフラセットアップ (テーブル作成等) に限定する。テスト固有の Arrange はテスト本体に書く

## 2. 1テスト1観点

1つの `it` は1つの振る舞いだけを検証する。

- **OK**: 同じ結果オブジェクトの構造を `toMatchObject` で一括検証（1 assert）
  ```typescript
  expect(body).toMatchObject({ name, structure, version });
  ```
- **OK**: 同じアクションの「結果」と「副作用」を 1 テストで両方確認。ただしテスト名が両方を表現していること
- **NG**: 独立した複数の観点（HTTP status / body 構造 / 副作用回数 / ID 形式 等）を 1 テストに詰め込む。最初の `expect` で失敗すると後続が見えず、何が壊れたか特定しにくい

```typescript
// WRONG: 観点 3 つを 1 テストに詰めた
it("作成して返す", async () => {
  expect(res.status).toBe(201);                 // HTTP layer
  expect(body).toMatchObject({ name: "..." });  // ビジネス層
  expect(typeof body.id).toBe("string");        // ID 形式
});

// CORRECT: 観点ごとに分ける
it("有効な入力を受けると 201 を返す", ...);
it("レスポンスに作成されたプロジェクトの内容を含める", ...);
it("作成されたプロジェクトには UUID 形式の ID が割り当てられる", ...);
```

判断基準: **assert が 3 つ以上あって、それぞれ別々の不変条件を観測しているなら分割する**。`toMatchObject({...})` のような「1 オブジェクトの形」を 1 度に検査するのは 1 観点扱いで OK。

## 3. テスト名はドメイン語で書く

`describe` は関数名/型名 OK。`it` は **ドメインの意味** で書く。SDK 用語・実装変数を漏らすな。

```typescript
// WRONG: SDK / 実装用語が漏れている
it("CauseからerrorTypeを抽出する", ...);
it("GetObjectCommand を呼び出して body を返す", ...);

// CORRECT: ドメイン語
it("原因が構造化されているときは、エラー種別とエラーメッセージを結合する", ...);
it("音声ファイルを読み込んで本文を返す", ...);
```

「SDK の」「ライブラリの」等の前置きが付いたら危険シグナル。

**ドメイン語に含まれる語**: 「リポジトリ」「サービス」「ユースケース」「ドメイン」「集約」など、設計用語として定着している語は `it` 名に書いてよい。NG なのは特定の SDK / 外部サービス / ライブラリ固有の名前 (Clerk, Neon, Drizzle, Hono, valibot 等)。

**describe の選び方**: `describe` には対象の関数名 / 型名 / ドメイン名のいずれを書いてもよい。判断基準は **`it` の主語が省略されても文意が通ること**。`describe("createUser")` で `it` が「ユーザーを作成すると ...」なら問題なし。逆に `describe` がドメイン名で `it` が「内部呼び出しを ...」になるなら、`it` 側に SDK 用語が漏れていないか §3 本文で再確認する。

### 実装用語の禁止リスト (頻出)

`it` 名に **下記の実装/構造用語が含まれていたら書き直す**。SDK 名以外でも「テストで観測したい振る舞い」ではなく「プログラムの中身」を語ってしまうと、リファクタで実装が変わるたびにテスト名が嘘になる。

| 禁止語 (例)                         | なぜ NG                                              | 書き換え例                                       |
| ----------------------------------- | ---------------------------------------------------- | ------------------------------------------------ |
| `セクション` / `フィールド` / `ルート` / `要素` / `項目` | コンポーネント・schema 構造を指す実装語              | 「会議の種別を解析依頼に伝える」のように振る舞いで書く |
| `埋め込む` / `結合する` / `除外する` / `除去する` | 内部処理の動詞 — 何が起きて欲しいかが不明瞭         | 「重複なしの発言者一覧を伝える」                   |
| `ラベル` / `ID`                     | UI 表現や識別子の話で振る舞いではない                | 「疑問点の内容を解析結果に保つ」                   |
| `5 セクション応答` / `1 行目`       | データ構造の数 — 仕様変更で数字が変わる              | 「ノウハウ・現場条件・疑問点・要約・要約表が揃った応答を受け取れる」 |
| `Storybook` / `play function` / `mock`     | テストインフラ用語 — テストの性質ではなく道具       | 「保存ボタンが disabled になる」のように観測される振る舞いで書く |
| `Blob` / `PNG` / `JPEG` / `Buffer` (識別子として) | Web Standard API / ファイル形式 — 振る舞いではなく実装の型 / 拡張子を語っている | 「画像」「画像ファイル」「バイナリ」 |
| `Container` / `Element` / `Node` (識別子として) | DOM API の技術語 | 「領域」「要素」 |

※ 型注釈 `: Blob` / `: HTMLElement` のように **TS 型システムで Web Standard 型として使う場合は OK**。Storybook play function の標準引数 (`canvasElement` / `canvas` / `within` 等) もフレームワーク API なので OK。**自前で付ける識別子名 / 関数名 / テスト名** に出るのが NG。

判定: `it` を読んで「**何が起きて欲しいか (= 観測される振る舞い)**」が伝わるか。「**プログラムが何をしているか**」になっていたら NG。

### テスト名は単独で観点が読めること

`it` 名は、**他のテストを読まずに単独で「何を観測しているか」が分かる**ように書く。「〜も」「同じ」「上記の通り」のように前テストとの対比に依存する名前は NG。前テストとの差分を語りたいなら、その差分自体を**観点としてテスト名に書く**。

```typescript
// WRONG: 何と同じか単独で読めない / 前テスト依存
it("暖房も同じ形式で組み立てる", ...);
it("上記と同じだが順位が違う場合", ...);
it("暖房の2チャンク目もゼロ埋めで命名する", ...); // 運転種別観点とゼロ埋め観点の混在

// CORRECT: 観点が単独で読める
it("運転種別が ZIP ファイル名に反映される", ...);    // 「運転種別 → ファイル名」観点
it("4桁の順位はゼロ埋め無しで連番化する", ...);       // ゼロ埋め有無の境界条件観点
```

判定: 「**ファイル全体を初めて読む人が、この `it` 1 行だけ見て、何を観測したいか分かるか**」。前後のテストを読む必要があるなら書き直す。

### テストへの技術語 leak は production 命名見直しのシグナル

テスト名 / テスト本文の識別子に技術語が leak していたら、ほぼ確実に **production 識別子側に同じ技術語がある**。テスト側だけリネームすると production と乖離するので、**まず production 側を疑って一緒に直す**。

例: テストに `画像Blob: new Blob(...)` が出ていたら、production の `生成済みデータ.画像Blob: Blob` フィールド名そのものが技術語 (`Blob`) の塊。production を `生成済みデータ.画像ファイル: Blob` に直し、テストは import するだけで自然に追随させる。テスト側で `画像Blob` を `画像` に書き換えるだけだと production と乖離する。

## 4. 期待値に実装ロジックを流出させない

期待値は **リテラルな答え** で書く。実装と同じ計算/同じ定数を期待値側に書いた瞬間、テストは「実装と同じバグを通す共犯者」になる。

```typescript
// WRONG: 実装と同じ式
expect(f(1)).toBe(1 * 120 + 3);

// CORRECT: リテラル
expect(f(1)).toBe(123);
```

リテラルが現実的でない長さなら、**不変条件** (長さ・接頭辞/接尾辞・形式) を assert する。実装のチューニング値 (240 等) はテストに登場させない。実装の値より明らかに緩い上限を契約として書く。

**チューニング値 vs 仕様値の判別**:
- **仕様値** = 外部に対する契約 (API レスポンスのフィールド形式、ドメインルールとして文書化されている定数)。`expect(...).toBe(リテラル)` で書いてよい。
- **チューニング値** = 実装者が「とりあえず」決めた閾値・サイズ・タイムアウト等。テストに直接書くと、値を変えるたびにテストも書き換える羽目になり共犯化する。`expect(...).toBeLessThan(契約として明らかに緩い上限)` で抽象化する。

判別の目安: **「この値を変える PR を出したとき、ビジネス的合意が必要か」**。Yes → 仕様値、No → チューニング値。`slice(0, 3)` の `3` のように一見実装ぽくても、「username 接頭辞は tenant の頭 3 文字」がドメイン仕様として合意されているなら仕様値。

## 5. モック必須テストは設計の悪臭 — 削除候補

**ここでいう「モック」とは**: `vi.fn()` / `jest.fn()` 等で外部 SDK・グローバル関数 (`fetch`, `Date.now` 等)・副作用持ち実装を **直接捕獲する** こと、および **`vi.stubGlobal` でブラウザ global (`matchMedia` / `ResizeObserver` / `navigator` 等) を monkeypatch する** ことを指す。

**「モック」に **含まれない** もの**: domain で定義した interface / `Context.Tag` (Effect-TS) / DI コンテナの差替は **正規の DI 注入** であり §5 の対象外。`Layer.succeed(SomeRepository, { ... })` でテスト用実装を差し込むのは、interface に対するもう 1 つの実装を提供しているだけ。これらは §9 (factory で構築) のルールが適用される。

「`fetch` を mock しないと書けない」「`as unknown as SDKClient` がないと書けない」テストは、ほぼ実装詳細テスト。次のいずれか:

1. **削除する**: 「URL X に POST する」を verify しているだけなら、e2e/統合テストで自然に拾える
2. **純粋関数を切り出す**: 検証したい本質ロジック (payload 組み立て等) を pure function として export し、引数→戻り値だけのテストにする
3. **DI interface 化**: SDK クライアントを mock したいなら interface を定義する (§6)

副作用 (DB 書き込み等) は mock せず **本物の DB を叩く** 統合テストでカバーする (下記「Infrastructure / Repository 層のテスト」)。

実 API を叩く価値しかない関数 (薄いラッパー) は、本質ロジックを pure function に切り出してそちらをテストする。SDK 呼び出しを mock しても、本物の挙動から乖離した「動いているように見えるだけのテスト」になりがち。

```typescript
// WRONG: SDK を mock してラッパー関数をテスト → 意味薄い
// CORRECT: ロジックを切り出してテストする
function buildRequest(input: Input): RequestPayload {
  /* ロジック */
}
async function callApi(input: Input) {
  return sdk.send(buildRequest(input)); // ← これは E2E or 本物の統合テストに任せる
}
```

`buildRequest` のような pure function は引数→戻り値のテストで十分。

ブラウザ API 依存の薄いフック (`useIsMobile` / `useMediaQuery` 等、`window.matchMedia` 等を包むだけのもの) も同じ。jsdom で global を `vi.stubGlobal` 差し替えしてテストするのは実装詳細テストで、`matchMedia` が `fetch` / `Date.now` でないことは省略理由にならない。本質ロジックがあれば pure function に切り出し、フックの実挙動は実機 (Storybook play / Playwright) で観測する。

**外部 SDK / 副作用を扱うときの判断順序**（§5 → §6 → 本物の統合テストの階層）:

1. **まず本質ロジックを pure function に切り出せないか**（本節）。切り出せたら pure func の unit test だけ書き、SDK 呼び出し部分はテスト対象から外す。
2. **副作用を含めて検証したい部分は本物の DB / サービスを叩く**（後述「Infrastructure / Repository 層のテスト」）。これが第一選択。
3. **本物で再現できない外部依存** (社外 API 等) や、**unit テストの粒度で振る舞いを観測したい場合のみ** §6 の DI interface 化に進む。`vi.fn()` で SDK を直接 mock するのは最後の選択肢。

実プロジェクトでは「pure 切り出し + DI interface unit test + 本物 DB 統合 test」の 3 層構成が典型。順序を守れば各層の責務が重複せず、テストが本物挙動から乖離するリスクも下がる。

## 6. `as unknown as` 禁止

二重キャストは型システムを破壊する。SDK クライアントを扱うなら DI interface を定義する。

```typescript
// WRONG
const mockClient = { send: async () => ({ body: ... }) } as unknown as SDKClient;

// CORRECT
interface MyClient {
  send(command: SomeCommand): Promise<SomeOutput>;
}
const mockClient: MyClient = {
  send: async (command) => ({ body: encode("..."), $metadata: {} }),
};
```

戻り値での個別フィールドへの限定的 `as SomeOutput` は許容。外部イベント型は handler が使うフィールドだけの独自 interface に縮める。

## 7. 実装詳細テストの削除

振る舞いではなく実装詳細をテストしているケース:

- **タイミングテスト**: `Promise.all` の並列実行を `Date.now()` の差分で検証 → フレーキー
- **内部 API 呼び出し回数**: ユーザーから見える振る舞いでないなら不要
- **内部データ構造の形式**: プロンプトの XML タグ構造など、出力に影響しない内部形式

判断基準: **「この実装を別の方法に変えても、外から見た振る舞いが同じならテストは通るべきか?」→ Yes なら実装詳細テスト**

**振る舞い観測 vs 実装詳細観測の境界 (典型例)**:

| 観測対象 | 種別 | 理由 |
|---|---|---|
| factory で `captured` した副作用呼び出しの **回数 (1 回 / 0 回 / 2 回以上)** | 振る舞い | 「保存処理が起きたか / 重複していないか」はドメインの不変条件 |
| factory で `captured` した副作用呼び出しの **引数 (input がそのまま渡るか)** | 振る舞い | 上位層→下位層の data flow 観測 |
| `vi.spyOn` で **内部 helper 関数** が何回呼ばれたか | 実装詳細 | helper は別実装に置換可能 |
| SDK Command の **クラス型** (`expect.any(SomeCommand)`) | 実装詳細 | SDK 仕様変更で別 Command に変わっても振る舞いは同じ |
| `Date.now()` 差分 | 実装詳細 | フレーキー、性能特性は別 (load test) で測る |

`captured.push(input)` で副作用回数や入力値を観測するのは振る舞い観測として OK。「内部 method を何回呼んだか」「内部生成オブジェクトの型」を見るのは NG。

## 8. 層をまたぐテストの取捨選択

下位層で十分テストされている観点を上位層で再テストしない。上位層は「下位層を組み合わせた振る舞い」だけをテストする。

ただし **下位層には上位層からは到達不可能なパスが存在しうる**:

- DB に invalid な値が入っている前提のマッピング失敗
- 外部 API のエラー応答の翻訳
- 内部 invariant の違反チェック

「routes / handler の統合テストが通っているから infra のテストは不要」の判断はこの種の盲点を生む。**実装ファイルごとに「上位から到達不能な分岐があるか」を確認する**。あれば下位層に unit test を必ず書く (詳細は下記「Infrastructure / Repository 層のテスト」)。

## 9. モックは factory 関数で

モジュールスコープの mutable state は使わない (リセット忘れ・テスト間汚染リスク)。各テストで独立したインスタンスを作る factory パターンを使う。

```typescript
const createMock = () => {
  const captured: string[] = [];
  const client: MyClient = {
    send: async (command) => {
      captured.push(extractPrompt(command));
      return mockResponse;
    },
  };
  return { client, captured };
};

it("...", async () => {
  const { client, captured } = createMock();
  // ...
});
```

統合テストで handler がモジュールスコープ生成される場合は `beforeEach` リセットを許容するが、生成自体は factory で。

**§9 (mock factory) と §10 (Object Mother / data factory) の関係**:

- **§9 = 副作用持ちのオブジェクト** (mock layer, mock client, mock repository) の構築方法。`captured` 配列等の状態キャプチャを伴う。
- **§10 = 純粋なテストデータ** (input DTO, claims, principal, row 等) の構築方法。値だけ。
- 両者は **別レイヤー**。1 つの mock factory の中で Object Mother を呼んで input をデフォルト化し、その結果を mock に渡す、という組み合わせは普通に発生する。「mock factory が Object Mother を兼ねる」のは責務混合なので避ける（input を捏造する関数と、副作用持ちオブジェクトを生成する関数は分ける）。

例:
```typescript
// §10: data factory (pure)
const aCreateTaskInput = (overrides = {}) => ({ title: "...", ...overrides });

// §9: mock factory (副作用持ち)
const createTaskRepoMock = () => {
  const captured: CreateTaskInput[] = [];
  const layer = Layer.succeed(TaskRepository, {
    作成する: (input) => { captured.push(input); return Effect.succeed(...); },
  });
  return { layer, captured };
};

it("...", () => {
  const { layer, captured } = createTaskRepoMock();          // §9
  const input = aCreateTaskInput({ title: "..." });          // §10
  // ...
});
```

## 10. テストデータは Object Mother で組む

テストの期待値が、`describe` 冒頭やトップレベルで定義された fixture に依存していると、`it` を単独で読んでも内容が追えない（assert に出てくる `"tenant-a"` が、どの input から来た値なのか scroll しないと分からない）。

**各テストの `it` 本文だけで「input のどの値が期待値に対応しているか」が読める** ように書く。

### Object Mother パターン

デフォルト値を返す factory を作り、各テストは override で **そのテストが気にするフィールドだけ** を指定する。

```typescript
// Object Mother: 妥当なデフォルトを返す factory
const aClaims = (overrides: Partial<Claims> = {}): Claims => ({
  sub: "default-user-id",
  "custom:tenant_id": "default-tenant",
  "custom:role": "member",
  ...overrides,
});

// CORRECT: input と期待値の対応が it 単体で見える
it("テナント識別子は Principal にそのまま乗る", () => {
  const claims = aClaims({ "custom:tenant_id": "acme" });

  const result = claimsToPrincipal(claims);

  expect(Either.getOrThrow(result).tenantId).toBe("acme"); // input acme → 期待値 acme
});

// WRONG: トップレベル fixture から値が漏れていて、it だけでは追えない
const 揃った認証情報 = { /* ... */ "custom:tenant_id": "tenant-a" /* ... */ };

it("...", () => {
  const result = claimsToPrincipal(揃った認証情報);

  expect(Either.getOrThrow(result).tenantId).toBe("tenant-a"); // なぜ tenant-a？
});
```

### 判断基準
- **`it` 単独で input → 期待値の対応が読み取れること**
- デフォルト値は factory に閉じ、テストごとに override で必要なフィールドだけ書く
- 否定パスは `aClaims()` から該当 field を omit / 不正値で上書きして表現する
- `describe` トップに `validInput` のような巨大な const を置くのは避け、factory で代替する

§9（モック factory）と同じ思想で、**入力データもテストごとに独立にビルドする**。

### 「妥当だが存在しない ID」は実フォーマットで作る

越境/404 テスト等で「バリデーションは通るが存在しない ID」が要るとき、`00000000-…-0000000000ff` のような任意のゼロ埋め値を使わない。`z.uuid()` / `z.string().uuid()` は **UUID の version/variant ビットも検証**するため、version nibble が 0 等の不正値は弾かれ、狙った 404 ではなく **400 (入力エラー) で先に落ちて**テストが誤った理由で失敗する (実際に踏んだ)。`uuidv7()` を呼ぶか、実在フォーマットの例 (`018f5e8a-9c30-7a01-…`) を使う。

## 11. テナント越境テスト必須

多テナント・多ユーザー境界がある機能を実装したら、**「他テナント／他ユーザーのリソースを取得・更新できないこと」を必ずテストする**。

業務上ありうる「想定外の組み合わせ」（別テナントの project ID で取得試行、別ユーザーの session を更新試行）は、漏れると一発で重大なセキュリティ欠陥になる。**正常系だけテストして安心しない**。

```typescript
// 必須: 越境拒絶
it("別テナントから他テナントの ID を指定すると 404 を返す", async () => {
  const created = createInTenantA();

  const res = await app.request(`/projects/${created.id}`, {
    headers: 認証(tenantOtherToken),
  });

  expect(res.status).toBe(404);
});
```

判断基準:
- リソースが `tenant_id` / `user_id` でスコープされているなら、テストは **複数テナント / 複数ユーザー** を arrange する
- 越境アクセスは **404 / 403** で拒絶される（権限違反を 200 で返さない）
  - **404**: read 系 (GET / list)。「他テナントのリソース ID は **存在しない** ように見せる」(リソース存在を秘匿)。enumeration 攻撃を防ぐ。
  - **403**: write 系 (POST / PATCH / DELETE) で、リクエスト body に明示的に他テナントを指定したケース。「権限が無い」をはっきり返す。
  - 既存リソースに対する write (`PATCH /resources/:id` で `:id` が他テナント) は基本 **404** (read と同じく存在秘匿) でよい。choice は API ガイドラインに従う。
- middleware・repository・service のどの層で防いでいるかに関わらず、**routes 統合レベルで観測する**（必須）

**どの層で書くか**:
- **routes 統合テスト = 必須**。「外部から到達したリクエストが拒絶される」を最終境界で観測する。ここを欠かすと「個別層は通っているのに routes 経由で穴がある」を見逃す。
- **service / repository 単体テスト = 任意の補強**。tenant スコープの判定が複雑（複数 BC を跨ぐ、role 別に挙動が変わる、etc.）で routes だけで網羅できないとき、下位層でも越境テストを足す。
- 単体層に越境テストを書くだけで routes 統合テストを省略するのは NG。逆向き (routes だけで service の越境テストを省略する) は通常 OK。

## 深刻度の指針 (レビュー時)

- **高 (削除/書き直し必須)**: フレーキー、何も検証していない、期待値が実装と同じ式、mock でしか書けない実装詳細、**テナント越境拒絶のテスト欠落**
- **中 (修正)**: 1テスト複数観点、`as unknown as`、層間重複、テスト名の SDK / Web Standard / DOM 技術語、前テスト依存のテスト名 (「〜も」「同じ」)、実装マジックナンバーの流出、トップレベル fixture に依存した assert
- **低 (見つけ次第)**: テスト名の微妙な不一致、mutable state

---

# インフラ・フレームワーク

## Infrastructure / Repository 層のテスト

DB / 外部 API を扱う層では 2 種類のロジックが混ざる:

1. **副作用部分**: SDK / DB クライアント呼び出し (Drizzle の `insert` / `select` 等)
2. **純粋変換**: 外部スキーマ → 内部型のマッピング、エラー翻訳、不変条件の検証

**この 2 つは別ファイルに分けてそれぞれテストする**。

```typescript
// infrastructure/postgres/project-mapper.ts ← 純粋変換
export const toProject = (
  row: ProjectRow,
): Either.Either<Project, RepositoryError> =>
  isProjectStructure(row.structure)
    ? Either.right({ /* ... */ })
    : Either.left(
        new RepositoryError({ message: `不正な structure: ${row.structure}` }),
      );

// infrastructure/postgres/projects-repo.ts ← 副作用
作成する: (input) =>
  Effect.gen(function* () {
    const inserted = yield* Effect.tryPromise({
      try: () => db.insert(projects).values(input).returning(),
      catch: toRepositoryError,
    });
    return yield* toProject(inserted[0]);  // 純粋変換は import して使う
  });
```

- **(1) 副作用** は本物の DB を叩く統合テストでカバー
- **(2) 純粋変換** は pure func の unit test でカバー（例: invalid な値 → エラー）

§8 の通り、上位層が通っているという理由だけで infra のテストを省略しない (上位層から到達不能な分岐は infra unit test でしか踏めない)。

### ローカルで再現できない外部依存: 「外部の形」は公式 fixture/docs に pin する

ローカル / エミュレータで**再現できない外部 API・SDK 依存**に依存する分岐 — エラー処理・retryable 判定・レスポンスや metadata の parse・**ハッピーパスのレスポンス形** — は、テストで**一度も実際に踏めない**。pure func に切り出して logic を unit test しても、その logic が前提とする「外部が実際に返す形」自体は自分のテストでは検証されない。fake/DI スタブにも同じ**思い込みの形**を書けば、テストも本番経路も両方緑になり、間違いに気づけない。

したがって、これらの分岐を書くときは:

- **「外部 API / SDK が実際に返す形」を公式 docs / SDK の型定義・エラー fixture で裏取りしてから** decode/分岐ロジックを書く。ローカルで踏めない以上、「テスト緑 = 正しい」は成り立たない。**fixture をその裏取りした実形のコピーにする** (推測値で埋めない)。
- decode/分岐は pure func に切り出し、裏取りした実形を入力に unit test する (logic 自体の回帰は防げる)。

## E2E Testing

Use **Playwright** as the E2E testing framework for critical user flows.

## Agent Support

- **e2e-runner** - Playwright E2E testing specialist
