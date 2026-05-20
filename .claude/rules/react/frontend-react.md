---
paths:
  - "apps/frontend/**/*.tsx"
---

## コンポーネント開発

- 新規コンポーネントには Story を作成する
- play function でインタラクションテストを記述する
- Storybook-first アプローチ: UI の確認は Storybook で行う

## Storybook preview の必須セット

`.storybook/preview.tsx` の decorator に以下を **すべて mount しておく**。1 個でも欠けると、本番では動くが Storybook で挙動が見えない / play function で検証できない、というバグが潜在化する。

| 必須項目                                   | 何のため                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **`QueryClientProvider`**                  | orval 生成 hooks が React Query 必須。**`useState` で per-story 隔離** (story 間の cache 汚染防止) |
| **`<Toaster />` (sonner)**                 | `toast.success/error/warning` を Storybook でも見える状態に                                        |
| **MSW (`mswLoader`)**                      | API mock。`onUnhandledRequest: "bypass"` で未モックは透過                                          |
| **`parameters.nextjs.appDirectory: true`** | `useRouter` / `useParams` 等 next/navigation を mount するために必須                               |

```tsx
// .storybook/preview.tsx
const preview: Preview = {
  loaders: [mswLoader],
  decorators: [
    (Story) => {
      const [queryClient] = useState(
        () =>
          new QueryClient({
            defaultOptions: {
              queries: { retry: false },
              mutations: { retry: false },
            },
          }),
      );
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
