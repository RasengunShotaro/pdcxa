---
paths:
  - "apps/frontend/**/*.tsx"
---

## 実装前のデザイン検討（順守ゲート）

frontend の tsx を **1 行でも書く前に**、以下を **この順番で実行する**。各ステップは「考慮する / 観点として意識する」では満たせない。**実際にツールを呼び、成果物を残す**こと。バッジ 1 個・項目 1 行のような小さな追加でも省略しない。

1. **動線シミュレーション（テキスト出力が必須）**: ドメイン (依存方向 / 業務フロー) から、ユーザーがこの UI に「どの画面から来て・何を見て・何を操作し・次どこへ行くか」を 2〜4 行で書き出す。スキーマやフィールドの有無を調べる data recon は動線シミュレーションではない（別物。両方やる）。
2. **what = 情報設計と必要な状態を決める（必須・成果物を残す）**: 何を見せ・操作させるか、扱う状態 (loading / empty / error / populated) を **列挙する**。状態の出し方・レイアウト合成・空 / エラー表示などの UI パターンは、思い込みで書かず **melta-ui の patterns / component contract を `search` / `get_component` で実際に引いて**決める（melta-ui は token だけでなく `patterns/interaction-states`・`layout`・`form` 等で「どんな状態・構成にするか」まで規定している）。**既存パターンで表現できない新規性の高い UI のときだけ** `frontend-design` skill を起動してアイデアを補う。「ささっと」「小さい変更だから」「もう分かっているから」は省略理由にならない。
3. **how = 使うトークン / クラス / variant を `melta-ui` MCP で先に引く（必須）**: コードを書く前に `get_token` / `get_component` で確定する。`check_rule` は書いた後の lint であり、それだけでは how を満たさない（既存コードのクラスをコピーして check_rule に通すのは NG）。
4. **デザインメモを tsx の前に提示する**: 上記 1〜3 の結論を数行のメモ（動線 / what＋状態 / how）としてコードより先に出す。メモの冒頭に **実際に引いた melta-ui の patterns / component / token 名（起動した場合は skill 名も）を 1 行の実行証跡として明記する**（例: `使用: melta-ui search(empty state), get_component(card), get_token(primary.500)`）。この証跡が無い、またはメモ自体が無いまま tsx を出力したら違反。

> なぜこの形か: 「観点でデザインを固める」と書くだけだと、`melta-ui` は事後 lint に縮退し、動線シミュレーションは schema 確認に置き換わり、状態の列挙も飛ばされる（実測で確認済み）。melta-ui patterns の参照・状態の列挙・デザインメモという **観測可能な成果物** を必須化して初めて効く。

## コンポーネント開発

- 新規コンポーネントには Story を作成する
- play function でインタラクションテストを記述する
- Storybook-first アプローチ: UI の確認は Storybook で行う

## Storybook preview の必須セット

`.storybook/preview.tsx` の decorator に以下を **すべて mount しておく**。1 個でも欠けると、本番では動くが Storybook で挙動が見えない / play function で検証できない、というバグが潜在化する。

| 必須項目                       | 何のため                                                               |
| ------------------------------ | ---------------------------------------------------------------------- |
| **`QueryClientProvider`**      | orval 生成 hooks が React Query 必須。**`useState` で per-story 隔離** (story 間の cache 汚染防止) |
| **`<Toaster />` (sonner)**     | `toast.success/error/warning` を Storybook でも見える状態に            |
| **MSW (`mswLoader`)**          | API mock。`onUnhandledRequest: "bypass"` で未モックは透過              |
| **`parameters.nextjs.appDirectory: true`** | `useRouter` / `useParams` 等 next/navigation を mount するために必須 |

```tsx
// .storybook/preview.tsx
const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    (Story) => {
      const [queryClient] = useState(() => new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
      }));
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    nextjs: { appDirectory: true },
    // ...
  },
};
```

**新しい Provider / Portal を `app/layout.tsx` に追加したら、`preview.tsx` にも同期する**。Storybook で「動かない / 見えない」現象の 9 割はここ。
