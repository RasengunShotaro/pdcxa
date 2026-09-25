# PR作成（チェック付き）

変更内容に応じた検証を実行し、全て通過したらPRを作成します。

## 手順

### 1. PR 先を取り込む

**検証より先に済ませる。** 後から取り込むと、step 3-4 を取り込み前のツリーに対して回したことになり、frontend の storybook まで含めて全部回し直しになる。

```bash
git fetch origin main
git merge --no-edit origin/main
```

### 2. 変更ファイルの特定

```bash
git diff origin/main --name-only
```

ローカル `main` は stale なことがあり、無関係ファイルが diff に混入する。必ず `origin/main` を基準にする。

変更されたファイルのパスから、以下のどの領域に変更があるかを判定する:
- **backend**: `apps/backend/` 配下のファイルが変更されている
- **frontend**: `apps/frontend/` 配下のファイルが変更されている

### 3. ルートで回すチェック（領域を問わず必須）

```bash
# リポジトリのルートで
bun run lint          # biome。全 workspace を横断して見る（warning も落とす）
bun run check-types
```

**workspace の中だけで緑にして済ませない。** biome はルートから全 workspace を見るので、`cd apps/backend && bun run lint` が緑でもルートでは `packages/` や `.claude/hooks/` の整形で落ちる。

### 4. 領域別のチェック

**backend 変更がある場合:**

```bash
cd apps/backend && bun run test
```

**frontend 変更がある場合:**

```bash
cd apps/frontend
bun run test                    # unit
bun run test:storybook --run    # story の play function（CI は回さない。ここでしか担保されない）
bun run doctor                  # React Doctor。score 低下なしを確認
```

**OpenAPI schema を変えた場合**（backend `app.openapi(...)` の zod。schema の `example` に載る定数を変えただけでも契約は動く）:

```bash
cd apps/frontend && bun run api:generate   # apps/backend/openapi.json と生成スキーマを再生成してコミット
```

契約 drift は backend の test / typecheck では検出できず、CI の「再生成ズレ検出」だけが落ちる。

全て通過しない場合は修正してから再実行する。

### 5. コードレビュー

diff が [development-workflow.md](../rules/common/development-workflow.md) のリスク領域（認可・不可逆なデータ操作・並行性・課金）に触れる場合は、PR 作成前に `/code-review` を起動する。AUTO_FIX は適用し、ESCALATE はユーザーに提示してから進む。

### 6. PR作成

全てのチェックが通過したら、PRを作成する。

- ベースブランチ: `main`
- **`gh pr create` の前に `git push` する。** step 1 のマージがローカルに留まったまま PR を作ると、GitHub 側の head には PR 先が入っておらず「PR 先に遅れたまま」の PR ができる（`git merge-base --is-ancestor origin/main origin/<自ブランチ>` で確認できる）。新規ブランチは `-u` を付ける
- 変更内容を分析して適切なタイトルと説明を作成
- `gh pr create` を使用
