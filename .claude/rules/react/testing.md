---
paths:
  - "apps/frontend/**/*.test.ts"
  - "apps/frontend/**/*.test.tsx"
  - "apps/frontend/**/*.spec.ts"
  - "apps/frontend/**/*.spec.tsx"
---

# React/Next.js Testing

> This file extends [typescript/testing.md](../typescript/testing.md) with React/Next.js specific content.

## ペアテストの代替: Storybook

React コンポーネントは テストとして **`.stories.tsx`** を書く:

- `Button.tsx` ↔ **`Button.stories.tsx`**
- Storybook の `play()` 関数で interaction テストを書く (CSF Test)
- Visual / interaction を一箇所でカバーできるならこちらを優先

## テスト不要な場所 (React/Next.js 固有)

- **Next.js app router 規約ファイル**: `layout.tsx` / `page.tsx` / `loading.tsx` / `error.tsx` / `not-found.tsx` / `template.tsx` / `default.tsx` / `route.ts` / `global-error.tsx`
  - レンダリングだけのページは E2E (Playwright) に任せる
- **shadcn コピペ**: `apps/frontend/src/components/ui/` 配下。upstream のテストを信頼する

これらは Stop hook (`.claude/hooks/check-test-pair.sh`) が自動除外する。

## Storybook テスト

**Story の追加・編集後は必ず `bun run test:storybook` を実行する。**

1. Storybook サーバーを起動（別ターミナルで `bun run storybook`）
2. `bun run test:storybook` で全 play function がエラーなく通ることを確認
3. コミット前に test:storybook パスを検証
