---
paths:
  - "apps/frontend/**/*.ts"
  - "apps/frontend/**/*.tsx"
---

# shadcn 徹底

React コンポーネントの SSOT は **shadcn (radix-nova)**。`apps/frontend/src/components/ui/` 配下が登録済み実装。**shadcn にあるものを自前で実装するな。**

## 必ず守れ

1. **新規 UI を書く前に、まず shadcn にあるか確認しろ。** shadcn MCP で `list_components` / `get_component` を呼んで利用可能なコンポーネントを調べる。MCP が未接続なら https://ui.shadcn.com/docs/components を見る
2. **shadcn にあるコンポーネントは shadcn を import しろ。** 素の `<button className="...">` を書く前に `import { Button } from "@/components/ui/button"` を試す
3. **無いものだけ自前で書け。** プロジェクト固有のドメインコンポーネント（例: `<UserCard user={...} />`）は自分で実装してよい。ただし内部は shadcn の Button / Card / Avatar 等を組み合わせて構成する
4. **追加は CLI 経由のみ。** `bunx shadcn@latest add <component>` を使う。`components/ui/` に手で .tsx を置くな
5. **アプリ固有のスタイル変更は呼び出し側で行う。** 単発の見た目調整は `components/ui/` の source をいじらず、呼び出し側で `className` を渡すか `cva` で variant を追加する（局所的な変更を ui に吸い上げない）。
6. **ただし `components/ui/` は「自分たちのコード」。** 一度 add したコンポーネントは vendored = 自分たちの保守対象であり、`shadcn add` で再同期はしない（ライブラリではない）。そのため横断的な保守は source を直接編集してよい・すべき:
   - lint / React Doctor の指摘（forwardRef→ref-as-prop の React19 移行、未使用 export 削除 等）は ui 配下も実コードで直す。blanket 除外で逃げない
   - melta-ui DESIGN.md 違反（`tracking-tight`・`shadow-lg` 等）は ui 配下も規約値に直す
   - React Compiler 起因の FP（`jsx-no-constructed-context-values` 等、手動メモ化が禁止のため直せないもの）だけは根拠付きで個別抑止する
7. **見た目が同じでも土台が違うコンポーネントを取り違えない。** 例: **Sheet**（Radix Dialog ベース・ドラッグ無し）と **Drawer**（vaul ベース・スワイプ閉じ + 背景スケール）は別物。デスクトップの右サイドパネルの正規 component は **Sheet**。用語感覚で選ばず「土台ライブラリ + 操作モデル」で選ぶ。
8. **禁止クラス回避や見た目調整を文字列の打ち消し hack で逃げない。** 例: コンポーネント既定の padding を消すのに呼び出し側へ `px-0 py-0` を重ねるのではなく、shadcn コンポーネントに正式 variant（`padding="none"` 等）を `cva` で足す（§5 と同じ精神）。理由: 打ち消し hack は意図が読めず DESIGN.md 違反 / 二重指定の温床になり、次に使う人が踏む。規約準拠・調整は再利用可能な variant として残す。

## なぜ

- 自前実装は a11y / focus 管理 / keyboard nav の事故ポイント。shadcn は radix-ui ベースで a11y 担保済み
- 「これは shadcn なのか自前なのか」の判別コストを排除する
- melta-ui のクラス規約（DESIGN.md）は shadcn が出力する Tailwind クラスに対しても効く。両方併用が前提
