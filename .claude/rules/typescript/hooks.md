---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# TypeScript/JavaScript Hooks

> This file extends [common/hooks.md](../common/hooks.md) with TypeScript/JavaScript specific content.

## PostToolUse Hooks

Configure in `~/.claude/settings.json`:

- **Prettier**: Auto-format JS/TS files after edit
- **TypeScript check**: Run `tsc` after editing `.ts`/`.tsx` files
- **console.log warning**: Warn about `console.log` in edited files

### 落とし穴: import は使用箇所と同一 edit で追加する

新規 import 行は、それを使うコードと **同じ edit** で追加する（理由: 保存時 auto-format の organizeImports が、まだ未使用の import を「不要」として削除する。import → 使用箇所を別 edit に分けると 1 段目で消され、実行時 `X is not defined` になる。typecheck では捕まらないこともある）。

同根の症状で、import 以外も「定義 → 使用」を別 edit に分けると保存時 auto-fix に壊される。**top-level の `const` / 関数を「定義したが未使用」状態にすると `_name` にリネーム**され（`Cannot find name 'name'. Did you mean '_name'?`）、**`import type * as x` も「値として `x.Foo()` を使う」コードが別 edit だと型 import に差し戻る**（`'x' cannot be used as a value`）。回避は同じ — **定義 / import は最初の使用と同一 edit で入れる**（多数のシンボルを足す新規ファイルは whole-file `Write` が安全）。各 edit 直後の typecheck でこれらのエラーが出たら本症状なので、消された側を即 re-add する。

## Stop Hooks

- **console.log audit**: Check all modified files for `console.log` before session ends
