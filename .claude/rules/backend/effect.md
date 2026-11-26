---
paths:
  - "apps/backend/**/*.ts"
---

# Backend: Effect-TS + オニオンアーキテクチャ (強制)

> backend の新規実装は **Effect-TS** で書く。関数型・副作用管理・DI・エラーハンドリングを Effect で統一。
> `async/await` だけで完結させない (副作用が型に出ず、エラーハンドリングがバラつく)。
>
> **例外**: Cloudflare Workers の entry point やフレームワーク境界 (`handle(app)` 等) のみ。

> 関連 (このファイルでは再掲しない、各リンク先に従う):
>
> - 業務の判断をどの層に置くか・ポートとリポジトリの形・エラーの握り潰し: [ddd.md](./ddd.md)
> - 型キャスト禁止 (`as unknown as` / `unknown` の扱い): [typescript/coding-style.md](../typescript/coding-style.md)
> - テスト規約 (AAA, factory, ドメイン語 など): [typescript/testing.md](../typescript/testing.md)
> - 外部の保存先からの読み取り（N+1・並列・絞り込みの一覧）: [data-access.md](./data-access.md)

## 手続きを Effect の外で書かない

**Effect で書けることは Effect で書く。** Promise や SDK を Effect に包むとき、包む中身は「外の API を呼んで、その結果を受け取る」ところまでにする（R2 の取得の応答から本体を読み出す、のような 1 回の呼び出しに付いた処理は含めてよい）。繰り返し・並列・待ち・取り直し・失敗の扱いを、包みの中の async/await・`for`・`setTimeout`・`try/catch` で書かない。

理由: 包みの中に書いた手続きは Effect から見えない。待ちは `Clock` を通らないのでテストで時間を差し替えられず、並列の数は型にもコードにも出ず、途中の失敗は 1 つの例外に潰れて種類を失う。読み手も、手続きと Effect の 2 つの書き方を行き来することになる。

| 手続きでやりたいこと | Effect で書く形 |
|---|---|
| 件数ぶん繰り返す・並列にする | `Effect.forEach(items, f, { concurrency })` |
| 待ってから取り直す | 再帰と `Effect.sleep`、または `Effect.retry` と `Schedule` |
| 複数の結果を待つ | `Effect.all([...], { concurrency })` |
| 失敗を種類で分ける | `Data.TaggedError` と `Effect.catchTag` |

## オニオンアーキテクチャ (層構造)

`backend/src/` を 4 層 + 共通ユーティリティに分ける。**依存は外から内への一方向のみ**。

```
backend/src/
├── routes/           # 最外層: Hono ルート、リクエスト/レスポンス変換
├── services/         # アプリケーション層: ユースケース、オーケストレーション
├── domain/           # コア層: 型、Service Tag、エラー型 (依存ゼロ)
├── infrastructure/   # 外部接続層: 外部 API / DB 操作、Layer 実装
└── lib/              # 外部 API / DB クライアント singleton、env 読み取り
```

依存方向:

```
routes → services → domain ← infrastructure ← lib
```

| 層             | 役割                                   | 依存先           | 主な API                              |
| -------------- | -------------------------------------- | ---------------- | ------------------------------------- |
| domain         | Service Tag、エラー型、純粋型定義、状態の述語などの純関数 | (なし) | `Context.Service`, `Data.TaggedError` |
| services       | ユースケース、層間オーケストレーション | domain           | `Effect.gen`, `yield*`                |
| infrastructure | 外部 API / DB の具象実装               | domain, lib      | `Layer.succeed`, `Effect.tryPromise`  |
| routes         | Hono ルート、Effect 実行と HTTP 変換   | services, domain | `runtime.runPromise`                  |
| lib            | 外部 API / DB クライアント singleton   | (内部のみ)       | -                                     |

## リクエストスコープの context は Service Tag で表現

`AuthContext`（誰がアクセスしているか）、`RequestId`、`Locale` など **全 use case が暗黙に必要とするリクエスト固有データ** は、引数で引き回さず Service Tag で注入する。

```typescript
// domain/auth/principal.ts
export class AuthContext extends Context.Service<
  AuthContext,
  Principal
>()("AuthContext") {}

// services/projects/get-project.ts — service の引数に tenantId を含めない
export const プロジェクトを取得する = (projectId: ProjectId) =>
  Effect.gen(function* () {
    const repo = yield* ProjectRepository;
    return yield* repo.取得する(projectId); // tenantId は repo 内部で AuthContext から取得
  });

// routes/projects.ts — middleware が決めた値を Tag に注入
app.openapi(spec, async (c) => {
  const principal = c.get("principal");

  return runtime.runPromise(
    プロジェクトを取得する(projectId).pipe(
      Effect.provideService(AuthContext, principal),
    ),
  );
});
```

理由:

- service / repository のシグネチャに `(tenantId, userId, ...)` を引き回さなくて済む（BC が増えても引数が爆発しない）
- テストで `Layer.succeed(AuthContext, fixturePrincipal)` で差し替えられる
- 監査ログ・tenant スコープのキャッシュ等の横断ロジックが後から `yield* AuthContext` で取り出せる

引数で渡したくなったら立ち止まる: それは context として表現すべきデータかもしれない。

## domain: Service Tag とエラー型

`Context.Service` で Service interface、`Data.TaggedError` でエラー型を定義する。**domain は他の層を import しない**。`Effect.gen` は書かない（判断は純関数にする。[ddd.md](./ddd.md)）。

```typescript
import { Context, Data, type Effect } from "effect";

export class SessionNotFoundError extends Data.TaggedError(
  "SessionNotFoundError",
)<{
  sessionId: string;
}> {}

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  message: string;
}> {}

export class SessionRepository extends Context.Service<
  SessionRepository,
  {
    readonly 作成する: (
      userId: string,
      sessionId: string,
      createdAt: string,
    ) => Effect.Effect<void, DatabaseError>;
    readonly 取得する: (
      userId: string,
      sessionId: string,
    ) => Effect.Effect<Session, SessionNotFoundError | DatabaseError>;
  }
>()("SessionRepository") {}
```

## infrastructure: Layer.succeed

domain の Tag に対して具象実装を `Layer.succeed` で提供する。**`Effect.tryPromise` はオブジェクト形式で `catch` を必ず書き、生例外を Tagged Error に翻訳する**。

```typescript
import { Effect, Layer } from "effect";
import { db } from "../lib/db";
import { sessions } from "../lib/schema";
import { DatabaseError, SessionRepository } from "../domain/session";

export const SessionRepositoryLive = Layer.succeed(SessionRepository, {
  作成する: (userId, sessionId, createdAt) =>
    Effect.tryPromise({
      try: () =>
        db.insert(sessions).values({ /* ... */ }).returning(),
      catch: (error) =>
        new DatabaseError({
          message: `作成失敗: ${error instanceof Error ? error.message : String(error)}`,
        }),
    }).pipe(Effect.asVoid),
});
```

### Layer 集約は BC ごとに分割する

`infrastructure/layers.ts` に全 Live Layer を直接 import すると、BC が増えるごとにそこが膨らむ。
**BC 単位の `infrastructure/{bc}/layer.ts` で「その BC が必要とするインフラ」を集約**し、
`infrastructure/layers.ts` は BC Layer 群の merge と横断依存（DbClient 等）の注入のみに専念する。

```
infrastructure/
├── postgres/                 # データソース別の実装（横断 + BC 別の repo）
│   ├── client.ts             # DbClient Tag + Live (横断)
│   └── projects-repo.ts      # ProjectRepositoryLive
├── projects/                 # BC 別の Layer 集約
│   └── layer.ts              # ProjectsLayer = mergeAll(ProjectRepositoryLive, ...)
├── meetings/                 # 別 BC が増えたらここに layer.ts
│   └── layer.ts
└── layers.ts                 # appLayer = mergeAll(ProjectsLayer, MeetingsLayer).pipe(Layer.provide(DbClientLive))
```

新 BC 追加時の手順:

1. `infrastructure/postgres/{bc}-repo.ts`（実装）
2. `infrastructure/{bc}/layer.ts` で BC が必要とするインフラを `Layer.mergeAll(...)`（後で外部 API 等が増えたらここに追記）
3. `infrastructure/layers.ts` の `Layer.mergeAll(...)` に 1 行追加

## services: Effect.gen

ユースケースは `Effect.gen` で記述。Service は `yield*` で取得。**infrastructure の具象には依存しない** (Tag 経由で受け取る)。現在時刻は `Clock` から読む（biome プラグイン Rule F）。

```typescript
import { DateTime, Effect } from "effect";
import { SessionRepository } from "../domain/session";
import { StorageService } from "../domain/storage";

export const セッションを作成する = (userId: string) =>
  Effect.gen(function* () {
    const repo = yield* SessionRepository;
    const storage = yield* StorageService;
    const sessionId = randomUUID();
    const now = yield* DateTime.nowAsDate;

    yield* repo.作成する(userId, sessionId, now.toISOString());
    const uploadUrl = yield* storage.アップロードURLを生成する(
      userId,
      sessionId,
    );

    return { sessionId, uploadUrl };
  });
```

## routes: ManagedRuntime の runPromise

`AppLive` を `ManagedRuntime.make(AppLive)`（`infrastructure/runtime.ts`）で 1 度だけ組み、Hono ルート内ではその `runtime.runPromise` で実行する（リクエストのたびに Layer を組み直さない。biome プラグイン Rule D）。エラーは `Effect.catchTag` で個別ハンドリング、残りを `Effect.catch`。

```typescript
sessions.get("/:id", async (c) => {
  return await runtime.runPromise(
    セッションを取得する(getUserId(c), c.req.param("id")).pipe(
      Effect.map((session) => c.json(session)),
      Effect.catchTag("SessionNotFoundError", () =>
        Effect.succeed(c.json({ error: "Not found" }, 404)),
      ),
      Effect.catch((error) =>
        Effect.succeed(c.json({ error: error.message }, 500)),
      ),
    ),
  );
});
```

`AppLive` は `Layer.mergeAll(SessionRepositoryLive, StorageServiceLive, ...)` を `infrastructure/layers.ts` で定義する。v4 の `Effect.provide` は ManagedRuntime を受けない（v3 の `Effect.provide(runtime)` は型エラーになる）。

### OpenAPI route schema は全フィールドに `.openapi({ example })` を付ける

`@hono/zod-openapi` の route schema は、**各フィールドと object 全体に `.openapi({ example })` を付ける**。欠けると、orval の mock 生成 (`api:generate`) が example の無いフィールドを `@faker-js/faker` で埋めようとし、生成された `api.msw.ts` が faker を import する。このリポは faker 未導入のため **frontend の typecheck が壊れる** (`Cannot find module '@faker-js/faker'`)。既存 route schema は全フィールドに example を付けており、新規も倣う。理由: orval は静的 example があればそれを mock 値に使い faker を呼ばない。

## エラーで分岐するなら `catchTag` / `catchTags`

エラー種別で挙動を変える場合は **必ず `Effect.catchTag` か `Effect.catchTags`** を使う。`runPromiseExit` で `Exit.cause` を `Cause.findErrorOption` で剥いて `_tag` を文字列比較するな (型安全性も Effect の旨味も捨てる)。

```typescript
// WRONG: Cause / Exit を生で触って分岐
const exit = await Effect.runPromiseExit(program);
if (exit._tag === "Failure") {
  const failureOpt = Cause.findErrorOption(exit.cause);
  if (Option.isSome(failureOpt) && failureOpt.value._tag === "FooError") {
    /* ... */
  }
}

// CORRECT: catchTag で個別ハンドリング、未指定の Tagged Error は呼出側に propagate
await Effect.runPromise(
  program.pipe(
    Effect.catchTag("FooError", (error) => Effect.logError(error.message)),
    Effect.catchTag("BarError", (error) => Effect.succeed(fallback)),
  ),
);
```

複数 Tag を一度に扱うなら `Effect.catchTags({ FooError: ..., BarError: ... })`。

`runPromiseExit` を使うのは「成功・失敗の両方を観測した上で副作用無く判定したいテストコード」など、**分岐ではなく検査** が目的のときに限る。

## テスト: Effect-TS 固有の mock Layer

mock layer は `Layer.succeed` で構築する。スタブは `Effect.succeed` / `Effect.void` / `Effect.fail` で返す。`Effect.runPromise + Effect.provide(testLayer)` で実行。

```typescript
const layer = Layer.succeed(SessionRepository, {
  作成する: () => Effect.void,
  取得する: (_, sessionId) =>
    Effect.fail(new SessionNotFoundError({ sessionId })),
});

const result = await Effect.runPromise(
  セッションを作成する("user-1").pipe(Effect.provide(layer)),
);
```

> mock の組み立て方 (factory で状態キャプチャ・各テスト独立) は [testing.md](../typescript/testing.md) §9。

## Effect v4 で v3 と変わったところ

改名の対応表は Effect の公式 `MIGRATION.md` / `migration/v3-to-v4.md`。v3 の書き方は大半が型エラーになるが、型が通ったまま挙動が変わるものがある。止め方ごとに分ける。

**biome プラグイン Rule E（`apps/backend/biome-plugins/effect/e-v4-pitfalls.grit`）で止まる**。テストファイルも対象:

- `Effect.forkChild` に `startImmediately` を渡さない呼び出し。v4 は既定で遅延開始で（v3 の `Effect.fork` は即時開始）、親が先に失敗して子を中断すると子は始まらず、子の `onInterrupt` も走らない。v3 と同じ順序なら `{ startImmediately: true }`
- `Effect.die` に文字列を渡す呼び出し。v4 は文字列をそのまま defect にする（v3 の `Effect.dieMessage` は Error に包んでいた）。`Effect.die(new Error("…"))` で渡す
- `_tag: "Failure"` / `"Success"` を含む `toMatchObject`。v4 の `Result` / `Exit` は `_tag` がプロトタイプ側にあり一致しない。`{ failure: … }` / `{ success: … }` で書く

**型エラーで止まる**（エラー文から直し方が読みにくいもの）:

- `Result`（旧 `Either`）は Effect の部分型ではない。Effect の文脈で `yield*` する・`Effect.all` に並べる・`Effect.flatMap` の戻り値にするときは `Effect.fromResult(...)` で包む。純関数（mapper）の戻り値は `Result` のままでよい。中身は `.success` / `.failure`
- `Effect.tap` の関数は Effect を返す。副作用だけなら最後に `return Effect.void`（`Effect.sync` は Rule A で禁止）
- `Effect.yieldNow` は関数ではなく値。`Effect.reduce` の初期値は値ではなく関数（`(): readonly T[] => []`）
- `Effect.provide` は ManagedRuntime を受けない。`runtime.runPromise` で実行する
- テスト用の時計は `effect/testing` の `TestClock`（`Effect.provide(TestClock.layer())`）、ログの差し替えは `Logger.layer([Logger.make(...)])`、`Schedule.intersect` は `Schedule.max([a, b])`

**レビューで見る**（構文では判別できない）:

- `Effect.die` に文字列以外の値（変数・関数の戻り値）を渡す箇所と、defect を受け取って `.message` や文字列として読むコード。Rule E は文字列リテラルしか見ない
- `Result` を返す純関数と、それを Effect の文脈に持ち込む箇所の境目。どこで `Effect.fromResult` に包むかは設計の判断
