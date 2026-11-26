---
paths:
  - "apps/backend/**/*.ts"
---

# Backend: Effect-TS × DDD の置き場と書き方

層構造・Service Tag・Layer・エラーで分岐するときの書き方は [effect.md](./effect.md)。ここは「業務の判断をどこに置くか」と、Effect で書くときのアンチパターン。構文で止められるものは biome プラグイン（`apps/backend/biome-plugins/effect/`）が止める。

## domain: 型・純関数・ポート・エラー型だけを置く

- **状態の意味は domain の述語・遷移関数に置く**。「〜の状態なら削除できない」「〜済みなら何もしない」のような判断は、domain のエンティティのファイルに `削除できるPDか(pd)` の形で書く（Rule H）。理由: status を読むロジックが services に散ると、状態を変えたときの影響箇所を洗い出せない。domain に集めておけば、状態を変えるときに見る場所は domain の 1 ファイルになる
- 述語・遷移関数は `Pick<Entity, "status">` のように使う欄だけを受け取る。テストが 1 行で書け、別の型にも使える
- **domain に `Effect.gen` / `Effect.fn` を書かない**（Rule G）。ポートを呼ぶ手続きは services のユースケースに書き、判断は値を受け取って値を返す純関数にする
- **純関数は現在時刻・id・乱数を自分で作らない**（Rule F・G）。引数で受け取る（`{ pd, now }`）。同じ入力に同じ答えを返すので、時刻の境目をテストで固定できる
- **不正な状態を型で作れなくする**。状態ごとに持つ欄が違うなら判別可能なユニオンにする。id は `Brand` で型を分ける（`PdId` と `UserId` を取り違えると型エラーになる）
- **外部の値は境界で型に直してから domain に渡す**。HTTP の入力は routes の schema、DB・外部 API の値は infrastructure の mapper で domain の型に直す。domain の関数は「検証済みの型」だけを受け取り、中で `unknown` を検査しない
- 失敗は `Data.TaggedError` で定義する。純関数の失敗は `Result` で返す（[effect.md](./effect.md) の v4 の節）

## services（ユースケース）: 読む → domain で決める → 書く

ユースケースの形は「ポートから読む → domain の純関数で決める → ポートに書く」。判断を真ん中の純関数に寄せるほど、services はテストの要らない並びになる。

**services に書いてよい分岐**:

- 取得の結果（見つからない・権限が無い）で失敗に倒す
- domain の述語の結果で進む・止まる（`if (!削除できるPDか(pd)) return yield* Effect.fail(...)`）
- エラーの種類で振る舞いを変える（`catchTag` / `catchTags`）
- ベストエフォートの段の縮退（失敗をログに残して代わりの値で続ける）
- 判別子でユニオンを絞り込んで中身を読む

**services に書かない分岐**:

- エンティティの `status` を文字列と比べる・`switch` する（Rule H が止める）
- services のファイルに `const ○○できる状態か = (x) => x.status === ...` のような業務の述語を作る。lint は呼び出し側の比較しか見ないので、述語ごと services に置くと素通りする。domain に移す
- 判別子の組み合わせで「何ができるか」を決める（それは状態の意味なので domain の述語にする。絞り込んで中身を読むだけなら services でよい）

**手続きを長く書いてよい場所**: 外部 API を順に呼んで縮退を挟むユースケースは、手続きのまま書いてよい。全部を domain のモデルにしない（業務の規則が薄いところまでモデル化すると、型と関数が増えるだけで守る不変条件が無い）。寄せるのは状態・承認・遷移のように規則があるところだけ。

- 現在時刻は `yield* DateTime.nowAsDate` / `yield* Clock.currentTimeMillis` で読む（Rule F）。テストで `TestClock` に差し替えられる。`new Date(ms)` のように値から日時を作るのはよい
- id の生成（`randomUUID()`）は services で行ってよい。domain に入れないことだけを守る

## ポート（domain の Context.Service）

- **メソッドの型の要求（R）は `never` にする**。例外はリクエスト単位の文脈の Tag（`AuthContext`）だけで、全ユースケースが暗黙に要るものを引数で引き回さないため（[effect.md](./effect.md) の「リクエストスコープの context」）。infrastructure の依存（DB クライアント等）はメソッドの型に出さず、Layer を組むときに閉じ込める（Effect 公式の「requirement leakage」。出すとテストで使わない依存まで用意させられる）
- **生の技術型をポートの型に出さない**。Drizzle の行の型・外部 SDK の型は infrastructure の mapper で domain の型に直す（外部の都合が domain に入らないようにする腐敗防止層）
- **リポジトリは集約ごとに業務語のメソッドで作る**（`PDにいいねする`）。汎用の `findAll(filters)` / `update(id, data)` を作らない（呼び出し側に DB の絞り込み条件が漏れ、リポジトリが DAO になる）
- 条件付き書き込みで状態遷移を守るのはよい。ただし「遷移してよいか」の判定は domain の関数と同じ規則にし、リポジトリの中だけで別の規則を持たない
- テストのためだけのメソッドをポートに足さない。テストでは `Layer.succeed` で別の実装を渡す

## 集約と書き込みの範囲

- 他の集約は id で参照する（オブジェクトを抱えない）
- 1 回の処理で書き換える集約は 1 つを基本にする。複数の集約を 1 回の書き込みで変えるなら、なぜ同時でないと壊れるかを PR に書く

## エラー

- **`Effect.fail` に文字列や素の `Error` を渡さない**（Rule A）。`catchTag` で拾えず、失敗の種類が型から消える。時間切れは `Effect.timeout` か `Cause.TimeoutError`（`_tag: "TimeoutError"`）を使う
- **失敗を見ずに握り潰さない**（Rule A）。`Effect.catch(() => Effect.succeed(null))` は不具合まで「無い」「成功」に畳む。想定する失敗だけ `catchTag` で拾うか、受け取った error をログに残してから代わりの値にする。「確かめられなかった」を「無い」にしてよいかは [common/coding-style.md](../common/coding-style.md) の「まだ分からないを成功・失敗のどちらかに畳まない」で判断する
- defect（`Effect.die`・throw）は不具合と不可能な状態にだけ使う。`catchCause` / `catchDefect` で defect まで止めるのは、止まると困る所に限り、`Cause.pretty(cause)` をログに残す

## lint（biome プラグイン）で止まるもの

実装は `apps/backend/biome-plugins/effect/`、回帰は `rules.test.ts` の snapshot。

- Rule A（全層）: `Effect.fail` に文字列・素の Error / 失敗を見ない `Effect.catch`・`catchCause`（引数なし・`_` で始まる引数）
- Rule F（domain・services）: `new Date()`（引数なし）/ `Date.now()` / `Math.random()` / `process.env` / `console.*` / `fetch`
- Rule G（domain）: `Effect.gen` / `Effect.fn` / `randomUUID()`
- Rule H（services）: `x.status === "…"` / `x.status !== "…"` / `switch (x.status)`

## lint にしていないもの（レビューで見る）

構文では見分けられないので止めていない。

- services に置いた業務の述語（上の「services に書かない分岐」の 2 つ目）
- `status` 以外の名前の状態の比較。状態を足す・変えるときは、同じ考え方で domain の述語に寄せる
- 失敗を見ない catch の別の書き方（`function` 式のハンドラ、`Effect.orElse` / `Effect.orElseSucceed` / `Effect.ignore`、error を受け取って使わないハンドラ）。最後のものは構文では止められない
- 判別子の比較。絞り込みと業務の判断が構文で区別できない
- ポートのメソッドの R に infrastructure の依存が出ていないか（`AuthContext` は正当で、Tag の種類を構文で区別できない）
- 生の技術型がポートの型に出ていないか
- `catchCause` / `catchDefect` を services に足すとき

## 調べて採らなかったもの

- **「サービス層では分岐を書かない」**: 出典（Vernon『実践ドメイン駆動設計』14 章「アプリケーションサービスは薄く、モデルへの調整だけに使う」）が言うのは業務の判断を置かないことで、分岐そのものではない。取得の結果・エラーの種類・縮退の分岐は残す
- **「貧血ドメインモデル」（Fowler）をそのまま当てる**: 型と関数を分けるのは関数型の普通の書き方（Wlaschin『Domain Modeling Made Functional』）。問題は規則が domain の外に散ることで、domain のファイルに型と純関数が並んでいれば貧血ではない
- **ドメインサービスの層を作る**: 複数のエンティティにまたがる判断も domain の純関数で書く。層を先に作ると、ユビキタス言語でない手続きの置き場になって膨らむ
- **`Effect.fn` を必須にする**（Effect Solutions の推奨）: トレースの基盤を入れていないので、名前付きの span を作っても見る場所が無い。基盤を入れるときに改めて決める
- **関数の中の `let` や `for` を禁じる**: 外に見えない局所の更新は純関数の中でもよい。外のオブジェクトを書き換えないことは [common/coding-style.md](../common/coding-style.md) の「データの扱い」で決めている

## 出典

- Evans『エリック・エヴァンスのドメイン駆動設計』: 層の責務・ドメインサービスの定義
- Vernon『実践ドメイン駆動設計』10 章（集約は id で参照・1 トランザクション 1 集約・集約間は結果整合）、14 章（アプリケーションサービス）
- Khononov『Learning Domain-Driven Design』5 章: 規則の薄いところは手続き（トランザクションスクリプト）でよい
- Wlaschin『Domain Modeling Made Functional』: 不正な状態を型で作れなくする・入出力を端に寄せる
- Mark Seemann「Impureim sandwich」（blog.ploeh.dk）: 読む → 純関数で決める → 書く
- Alexis King「Parse, don't validate」: 境界で型に直す
- Effect 公式ドキュメント v4（effect.website）: 期待される失敗と defect の区別・requirement leakage・`DateTime.now` は `Clock` を読む
