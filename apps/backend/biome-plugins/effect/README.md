# Effect-TS オニオン Linter — GritQL メモ（実測済み）

`*.grit` を編集するとき必ず踏む落とし穴。ルールの意図・層マッピングは各 `.grit` 冒頭コメントと
`biome.json` を、回帰テストの仕組みは `rules.test.ts` 冒頭コメントを参照。

- `register_diagnostic` の `span` には**束縛した変数**を渡す（`` `Pattern` as $n `` で束縛し
  `span = $n`）。未束縛だと `cannot create resolved snippet from unresolved variable`。
- `<:` の正規表現は**完全一致（両端アンカー）**。前方一致は `provide.*` のように `.*` を付ける
  （`^provide` 単独では一致しない）。
- 正規表現の**キャプチャグループ `( )` は使わない**（`matched N variables, but expected 0` で沈黙）。
- **選択 `a|b` は枝ごとに両端アンカーされない**。`r"catch|catchCause"` は `catchTag` にも一致した
  （先頭の枝が前方一致になる）。名前を列挙するなら `` or { `Effect.catch`, `Effect.catchCause` } ``
  のようにパターンを並べる。正規表現の選択を使ってよいのは `run.*|provide.*` のように全部の枝が前方一致でよいときだけ。
- 呼び出しの引数の数で分けるときは、**引数の多い形を `or` の先に並べる**。`Effect.catch($handler)` を先に置くと
  2 引数の呼び出しでも `$handler` が引数の並び全体に当たり、後ろの `Effect.catch($self, $handler)` が試されない。
- `switch` はスニペット（`` `switch ($x) { $cases }` ``）では一致しない。構文ノード
  `JsSwitchStatement(discriminant=$d)` で書く。
- Biome 2.5 は**プラグイン診断を `// biome-ignore` で抑止できない**（`suppressions/parse` エラー）。
  例外を作るなら `includes` 否定でファイル単位に除外する。
- `.grit` は Biome のフォーマッタ対象。編集後は `biome format --write apps/backend/biome-plugins/effect/*.grit`。
- プラグインの `includes` グロブは `**/<dir>/**` 形式で書く（`backend/**` は一致しない）。
