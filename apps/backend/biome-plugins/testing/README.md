# テストのアンチパターン Linter — GritQL メモ（実測済み）

ルールの意図は `.claude/rules/typescript/testing.md`（§4・§6・§12〜§16）、GritQL 全般の落とし穴は `../effect/README.md` を参照。ここはこのプラグインで踏んだものだけ。

- **スニペットの候補を並べるほど遅くなる。1 つの形で拾ってから中で分ける**。最初は規則ごとに `expect(...).toBe(...)` などの候補を並べた 11 個の `or` を 1 ファイルにまとめていて、テストファイル 1,456 本に 2 スレッド（CI の runner 相当）で 52.5 秒かかった（プラグイン無しは 0.9 秒）。同じ規則を別々のファイルに分けると 16.9 秒、`$recv.$matcher($expected)` の 1 つの形で拾って `$recv` / `$matcher` / `$actual` を `where` の中で絞り、規則を `or { and { … } }` の枝にした今の形で約 6 秒。修正前のツリー（違反 399 件）で、旧と新の検出は場所まで一致した。規則を足すときは `expect-assertions.grit` の枝として足し、新しいスニペットの候補を外側に並べない
- 計り方: このプラグインだけを当てた config で `RAYON_NUM_THREADS=2 node_modules/.bin/biome lint --config-path=<config> .` の時間を見る（Biome 2.5 に `--threads` は無い）
- **フィクスチャのファイル名をテスト名（`*.test.ts`）にしない**。テストランナーがフィクスチャを実行して落ちる。`rules.test.ts` が生成する config で plugin と override の `includes` を `**/__fixtures__/**` に差し替えている
- 「リテラルだけの式は通す」は `$expected <: not r"[\s\d_.eE*/%()+,-]+"` で書いている。正規表現は両端アンカーなので、式全体が数字と演算子だけのときにだけ外れる。引数を複数行に折ると `$expected` のテキストに末尾のカンマが入るので、カンマも文字の集合に入れている
- `expect($actual, $...)` で、2 つ目の引数（失敗時のメッセージ）がある expect も拾う。`expect($actual)` だけだと引数 2 つの expect をすり抜ける
- await の有無は `$n <: not within \`await $awaited\`` で見る。`return` も同じ形で外している
- `expect<T>(…)` / `new Promise<T>(…)` の型引数つき呼び出しは、型引数なしのスニペットに一致しない。両方を並べている
- `where` の中の `or` は最初に当たった枝で止まるので、1 つの expect に出る診断は 1 つだけ（`expect(true).toBe(true)` はリテラルの診断だけが出る）
- Biome の `noConditionalExpect` / `useExpect` / `noIdenticalTestTitle` は nursery（2.5 時点）。名前や group が変わったら `biome.json` の override と snapshot が割れる
