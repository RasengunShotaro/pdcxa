# Effect-TS オニオン Linter — GritQL メモ（実測済み）

`*.grit` を編集するとき必ず踏む落とし穴。ルールの意図・層マッピングは各 `.grit` 冒頭コメントと
`biome.json` を、回帰テストの仕組みは `rules.test.ts` 冒頭コメントを参照。

- `register_diagnostic` の `span` には**束縛した変数**を渡す（`` `Pattern` as $n `` で束縛し
  `span = $n`）。未束縛だと `cannot create resolved snippet from unresolved variable`。
- `<:` の正規表現は**完全一致（両端アンカー）**。前方一致は `provide.*` のように `.*` を付ける
  （`^provide` 単独では一致しない）。
- 正規表現の**キャプチャグループ `( )` は使わない**（`matched N variables, but expected 0` で沈黙）。
  選択は `run.*|provide.*` のように各枝を完全パターンにする。
- Biome 2.5 は**プラグイン診断を `// biome-ignore` で抑止できない**（`suppressions/parse` エラー）。
  例外を作るなら `includes` 否定でファイル単位に除外する。
- `.grit` は Biome のフォーマッタ対象。編集後は `biome format --write apps/backend/biome-plugins/effect/*.grit`。
- プラグインの `includes` グロブは `**/<dir>/**` 形式で書く（`backend/**` は一致しない）。
