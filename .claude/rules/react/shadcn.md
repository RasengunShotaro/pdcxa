---
paths:
  - "apps/frontend/**/*.ts"
  - "apps/frontend/**/*.tsx"
---

# shadcn 徹底

React コンポーネントの SSOT は **shadcn (radix-nova)**。`frontend/src/components/ui/` 配下が登録済み実装。**shadcn にあるものを自前で実装するな。**

## 必ず守れ

1. **新規 UI を書く前に、まず shadcn にあるか確認しろ。** shadcn MCP で `list_components` / `get_component` を呼んで利用可能なコンポーネントを調べる。MCP が未接続なら https://ui.shadcn.com/docs/components を見る
2. **shadcn にあるコンポーネントは shadcn を import しろ。** 素の `<button className="...">` を書く前に `import { Button } from "@/components/ui/button"` を試す
3. **無いものだけ自前で書け。** プロジェクト固有のドメインコンポーネント（例: `<UserCard user={...} />`）は自分で実装してよい。ただし内部は shadcn の Button / Card / Avatar 等を組み合わせて構成する
4. **追加は CLI 経由のみ。** `bunx shadcn@latest add <component>` を使う。`components/ui/` に手で .tsx を置くな
5. **既存の shadcn コンポーネントを書き換えるな。** スタイル変更は呼び出し側で `className` を渡すか、`cva` で variant を追加する。`components/ui/` の source を直接編集すると次回 `shadcn add` で diff 戻しの事故になる

## なぜ

- 自前実装は a11y / focus 管理 / keyboard nav の事故ポイント。shadcn は radix-ui ベースで a11y 担保済み
- 「これは shadcn なのか自前なのか」の判別コストを排除する
- melta-ui のクラス規約（DESIGN.md）は shadcn が出力する Tailwind クラスに対しても効く。両方併用が前提
