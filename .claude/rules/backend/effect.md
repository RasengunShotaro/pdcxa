---
paths:
  - "apps/backend/**/*.ts"
---

# Backend: Effect-TS + オニオンアーキテクチャ (強制)

> backend の新規実装は **Effect-TS** で書く。関数型・副作用管理・DI・エラーハンドリングを Effect で統一。
> `async/await` だけで完結させない (副作用が型に出ず、エラーハンドリングがバラつく)。
>
> **例外**: Lambda の entry point やフレームワーク境界 (`handle(app)` 等) のみ。

> 関連 (このファイルでは再掲しない、各リンク先に従う):
>
> - 型キャスト禁止 (`as unknown as` / `unknown` の扱い): [typescript/coding-style.md](../typescript/coding-style.md)
> - テスト規約 (AAA, factory, ドメイン語, MiniStack など): [typescript/testing.md](../typescript/testing.md)

## オニオンアーキテクチャ (層構造)

`backend/src/` を 4 層 + 共通ユーティリティに分ける。**依存は外から内への一方向のみ**。

```
backend/src/
├── routes/           # 最外層: Hono ルート、リクエスト/レスポンス変換
├── services/         # アプリケーション層: ユースケース、オーケストレーション
├── domain/           # コア層: 型、Service Tag、エラー型 (依存ゼロ)
├── infrastructure/   # 外部接続層: AWS SDK 操作、Layer 実装
└── lib/              # AWS SDK クライアント singleton、env 読み取り
```

依存方向:

```
routes → services → domain ← infrastructure ← lib
```

| 層             | 役割                                   | 依存先           | 主な API                              |
| -------------- | -------------------------------------- | ---------------- | ------------------------------------- |
| domain         | Service Tag、エラー型、純粋型定義      | (なし)           | `Context.Tag`, `Data.TaggedError`     |
| services       | ユースケース、層間オーケストレーション | domain           | `Effect.gen`, `yield*`                |
| infrastructure | AWS SDK / 外部 API の具象実装          | domain, lib      | `Layer.succeed`, `Effect.tryPromise`  |
| routes         | Hono ルート、Effect 実行と HTTP 変換   | services, domain | `Effect.runPromise`, `Effect.provide` |
| lib            | AWS SDK クライアント singleton         | (内部のみ)       | -                                     |

## リクエストスコープの context は Service Tag で表現

`AuthContext`（誰がアクセスしているか）、`RequestId`、`Locale` など **全 use case が暗黙に必要とするリクエスト固有データ** は、引数で引き回さず Service Tag で注入する。

```typescript
// domain/auth/principal.ts
export class AuthContext extends Context.Tag("AuthContext")<
  AuthContext,
  Principal
>() {}

// services/projects/get-project.ts — service の引数に tenantId を含めない
export const プロジェクトを取得する = (projectId: ProjectId) =>
  Effect.gen(function* () {
    const repo = yield* ProjectRepository;
    return yield* repo.取得する(projectId); // tenantId は repo 内部で AuthContext から取得
  });

// routes/projects.ts — middleware が決めた値を Tag に注入
app.openapi(spec, async (c) => {
  const principal = c.get("principal");

  return Effect.runPromise(
    プロジェクトを取得する(projectId).pipe(
      Effect.provideService(AuthContext, principal),
      Effect.provide(appLayer),
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

`Context.Tag` で Service interface、`Data.TaggedError` でエラー型を定義する。**domain は他の層を import しない**。

```typescript
import { Context, Data, type Effect } from "effect";

export class SessionNotFoundError extends Data.TaggedError(
  "SessionNotFoundError",
)<{
  sessionId: string;
}> {}

export class DynamoDBError extends Data.TaggedError("DynamoDBError")<{
  message: string;
}> {}

export class SessionRepository extends Context.Tag("SessionRepository")<
  SessionRepository,
  {
    readonly 作成する: (
      userId: string,
      sessionId: string,
      createdAt: string,
    ) => Effect.Effect<void, DynamoDBError>;
    readonly 取得する: (
      userId: string,
      sessionId: string,
    ) => Effect.Effect<Session, SessionNotFoundError | DynamoDBError>;
  }
>() {}
```

## infrastructure: Layer.succeed

domain の Tag に対して具象実装を `Layer.succeed` で提供する。**`Effect.tryPromise` はオブジェクト形式で `catch` を必ず書き、生例外を Tagged Error に翻訳する**。

```typescript
import { Effect, Layer } from "effect";
import { docClient } from "../lib/dynamodb";
import { DynamoDBError, SessionRepository } from "../domain/session";

export const SessionRepositoryLive = Layer.succeed(SessionRepository, {
  作成する: (userId, sessionId, createdAt) =>
    Effect.tryPromise({
      try: () =>
        docClient.send(
          new PutCommand({
            /* ... */
          }),
        ),
      catch: (error) =>
        new DynamoDBError({
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
2. `infrastructure/{bc}/layer.ts` で BC が必要とするインフラを `Layer.mergeAll(...)`（後で S3 等が増えたらここに追記）
3. `infrastructure/layers.ts` の `Layer.mergeAll(...)` に 1 行追加

## services: Effect.gen

ユースケースは `Effect.gen` で記述。Service は `yield*` で取得。**infrastructure の具象には依存しない** (Tag 経由で受け取る)。

```typescript
import { Effect } from "effect";
import { SessionRepository } from "../domain/session";
import { StorageService } from "../domain/storage";

export const セッションを作成する = (userId: string) =>
  Effect.gen(function* () {
    const repo = yield* SessionRepository;
    const storage = yield* StorageService;
    const sessionId = randomUUID();

    yield* repo.作成する(userId, sessionId, new Date().toISOString());
    const uploadUrl = yield* storage.アップロードURLを生成する(
      userId,
      sessionId,
    );

    return { sessionId, uploadUrl };
  });
```

## routes: Effect.runPromise + Effect.provide

Hono ルート内で `Effect.runPromise` 実行。`Effect.provide(appLayer)` で Layer を注入。エラーは `Effect.catchTag` で個別ハンドリング、残りを `Effect.catchAll`。

```typescript
sessions.get("/:id", async (c) => {
  return await Effect.runPromise(
    セッションを取得する(getUserId(c), c.req.param("id")).pipe(
      Effect.map((session) => c.json(session)),
      Effect.catchTag("SessionNotFoundError", () =>
        Effect.succeed(c.json({ error: "Not found" }, 404)),
      ),
      Effect.catchAll((error) =>
        Effect.succeed(c.json({ error: error.message }, 500)),
      ),
      Effect.provide(appLayer),
    ),
  );
});
```

`appLayer` は `Layer.mergeAll(SessionRepositoryLive, StorageServiceLive, ...)` を `infrastructure/layers.ts` で定義する。

## エラーで分岐するなら `catchTag` / `catchTags`

エラー種別で挙動を変える場合は **必ず `Effect.catchTag` か `Effect.catchTags`** を使う。`runPromiseExit` で `Exit.cause` を `Cause.failureOption` で剥いて `_tag` を文字列比較するな (型安全性も Effect の旨味も捨てる)。

```typescript
// WRONG: Cause / Exit を生で触って分岐
const exit = await Effect.runPromiseExit(program);
if (exit._tag === "Failure") {
  const failureOpt = Cause.failureOption(exit.cause);
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
