---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# TypeScript/JavaScript Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with TypeScript/JavaScript specific content.

## Types and Interfaces

Use types to make public APIs, shared models, and component props explicit, readable, and reusable.

### Public APIs

- Add parameter and return types to exported functions, shared utilities, and public class methods
- Let TypeScript infer obvious local variable types
- Extract repeated inline object shapes into named types or interfaces

```typescript
// WRONG: Exported function without explicit types
export function formatUser(user) {
  return `${user.firstName} ${user.lastName}`
}

// CORRECT: Explicit types on public APIs
interface User {
  firstName: string
  lastName: string
}

export function formatUser(user: User): string {
  return `${user.firstName} ${user.lastName}`
}
```

### 引数 2 つ以上は options object で受ける

引数を 2 つ以上取る関数は、位置引数でなく options object（`{ field }` 分割代入）で受ける（理由: 位置引数は順番を取り違えうる。特に複数の引数が同じ型だと、入れ替えても型エラーにならずサイレントに壊れる。object 引数なら呼び出し側がフィールド名で固定され、取り違えが型レベルで消える）。任意引数は `?` + 分割代入のデフォルトにする。sibling 関数は揃える（片方だけ object 引数だと不整合）。単一引数はそのままでよい。

```typescript
// WRONG: 同型の位置引数（question と siteDigest を入れ替えても型は通る）
function buildKnowhowQuery(question: string, tradeId: string, siteDigest: string): string

// CORRECT: options object
interface BuildKnowhowQueryInput {
  readonly question: string
  readonly tradeId: string
  readonly siteDigest?: string
}
function buildKnowhowQuery({ question, tradeId, siteDigest = '' }: BuildKnowhowQueryInput): string
```

### Interfaces vs. Type Aliases

- Use `interface` for object shapes that may be extended or implemented
- Use `type` for unions, intersections, tuples, mapped types, and utility types
- Prefer string literal unions over `enum` unless an `enum` is required for interoperability

```typescript
interface User {
  id: string
  email: string
}

type UserRole = 'admin' | 'member'
type UserWithRole = User & {
  role: UserRole
}
```

### `as` キャスト禁止

`as` キャストは使わない。Type Guard や Optional Chaining で型を絞り込むこと。

```typescript
// WRONG: as cast
const user = data as User

// CORRECT: Type Guard
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data
}

if (isUser(data)) {
  console.log(data.id) // safely narrowed
}
```

### Avoid `any`

- Avoid `any` in application code
- Use `unknown` for external or untrusted input, then narrow it safely
- Use generics when a value's type depends on the caller

```typescript
// WRONG: any removes type safety
function getErrorMessage(error: any) {
  return error.message
}

// CORRECT: unknown forces safe narrowing
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}
```

### React Props

- Define component props with a named `interface` or `type`
- Type callback props explicitly
- Do not use `React.FC` unless there is a specific reason to do so

```typescript
interface User {
  id: string
  email: string
}

interface UserCardProps {
  user: User
  onSelect: (id: string) => void
}

function UserCard({ user, onSelect }: UserCardProps) {
  return <button onClick={() => onSelect(user.id)}>{user.email}</button>
}
```

### JavaScript Files

- Do not add JSDoc as a substitute for types.
- If type clarity is needed, prefer migrating the file to TypeScript or extracting named types in nearby TypeScript code.

## 命名規律 (次の作業者の認知負荷を下げる)

### 数字接尾辞は並列概念のみ

`xxx1` / `xxx2` のような数字接尾辞は **並列に交換可能な値** にだけ使う。意味が独立した別軸を `1` / `2` で表現するのは禁止。

```typescript
// WRONG: 意味が独立した別軸 (管理観点軸 と 専門分野軸) を数字で区別
interface SummaryRow {
  category1: '品質' | '工程' | 'コスト' | '安全' | '環境'  // 管理観点
  category2: '意匠' | '構造' | '設備' | '共通'              // 専門分野
}

// CORRECT: 軸の意味を名前にする
interface SummaryRow {
  managementAspect: '品質' | '工程' | 'コスト' | '安全' | '環境'
  discipline: '意匠' | '構造' | '設備' | '共通'
}
```

判定: 「`xxx1` を `xxx2` に入れ替えても意味が通るか」 — Yes なら数字 OK (例: `tag1, tag2, tag3` のリスト)、No なら別名にする。

### `Id` 接尾辞をユーザー向けラベルに出さない

`tradeId` / `meetingId` のようなフィールド名は実装上は OK だが、UI ラベルとして「工種 ID」「ミーティング ID」を出すのは禁止。**ドメイン語**で表示する。

```tsx
// WRONG: ID をラベルに出す (ユーザーは ID を見ない)
<Field label="工種 ID" value={meeting.tradeId} />

// CORRECT: ドメイン語に直す + 値も日本語ラベル化
<Field label="工種" value={TRADE_LABELS[meeting.tradeId]} />
```

### 他 BC と紛らわしいラベルは BC 文脈に絞る

複数の BC (Bounded Context) で類似した語を使うときは、**BC を区別できるラベル** にする。「ファイル取込」のような汎用語が複数 BC で混在すると、ユーザーは BC 境界を理解できない。

```typescript
// Meeting BC の inputMethod (会議の音声/動画ファイル) と
// DocumentImport BC (書類取込) が「ファイル取込」で重なる

// WRONG: 両 BC で同じ「ファイル取込」を使う
const INPUT_METHOD_LABELS = { upload: "ファイル取込", realtime: "リアルタイム" }

// CORRECT: Meeting 固有の文脈に絞る
const INPUT_METHOD_LABELS = { upload: "録音・録画ファイル", realtime: "リアルタイム録音" }
```

判定: 「他 BC のメニューに同じ語があるか」 — あれば差別化必須。

### ドメイン関数名は目的語を含める

関数名だけ見て戻り値の主語が分かるようにする。リポジトリ名や呼び出し文脈に頼らない。

```typescript
// CORRECT
プロジェクト配下のミーティング件数を集計する(projectId)
ミーティングの疑問点を取得する(meetingId)

// WRONG (何を集計? 何を取得?)
プロジェクト配下を集計する(projectId)
ミーティングごとに取得する(meetingId)
```

判定: 「関数名だけを別ファイルで見たとき、戻り値の意味が伝わるか」。

### 日本語識別子は自然な業務語にする

ドメイン層の日本語名は、PdM や現場担当者が読んで違和感なく通じる業務語にする。英語クラス名 (`DocumentImport` 等) の機械的な訳語ではなく、業務シナリオで実際に使う語を選ぶ。

```typescript
// CORRECT (entity を表す名詞として読める)
取込ファイル / ミーティング / 案件

// WRONG (動詞句が entity 名詞に化けて曖昧)
書類取込  // 「書類を取り込む」行為? それとも取り込まれた何か?
```

判定: 「名詞として読んだとき、行為と entity のどちらか曖昧に聞こえないか」。曖昧なら別語に変える。

このルールが対象とするのは **識別子・entity ラベル**（型名 / フィールド名 / モノを指す UI ラベル）。サイドバーやタブの **機能・メニュー名** は対象外で、`書類取込` のような動詞句のままでよい（entity を別語で分離していれば OK。例: メニュー名「書類取込」／ entity「取込ファイル」の併存は意図的で違反ではない）。

## Immutability

Use spread operator for immutable updates:

```typescript
interface User {
  id: string
  name: string
}

// WRONG: Mutation
function updateUser(user: User, name: string): User {
  user.name = name // MUTATION!
  return user
}

// CORRECT: Immutability
function updateUser(user: Readonly<User>, name: string): User {
  return {
    ...user,
    name
  }
}
```

## Error Handling

Use async/await with try-catch and narrow unknown errors safely:

```typescript
interface User {
  id: string
  email: string
}

declare function riskyOperation(userId: string): Promise<User>

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unexpected error'
}

const logger = {
  error: (message: string, error: unknown) => {
    // Replace with your production logger (for example, pino or winston).
  }
}

async function loadUser(userId: string): Promise<User> {
  try {
    const result = await riskyOperation(userId)
    return result
  } catch (error: unknown) {
    logger.error('Operation failed', error)
    throw new Error(getErrorMessage(error))
  }
}
```

## Input Validation

Use Zod for schema-based validation and infer types from the schema:

```typescript
import { z } from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

type UserInput = z.infer<typeof userSchema>

const validated: UserInput = userSchema.parse(input)
```

## Console.log

- No `console.log` statements in production code
- Use proper logging libraries instead
- See hooks for automatic detection
