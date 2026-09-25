# Development Workflow

> This file extends [common/git-workflow.md](./git-workflow.md) with the feature development process before git operations.

## Feature Implementation Workflow

0. **Domain Understanding** _(最優先)_
   - ドメイン概念に触れる UI / 構造を作る前に、ドメイン文書があれば読む
   - 無ければユーザーに業務概念・依存関係・プロセス順序を聞く
   - UI のグループ化 / 並び順 / 優先度はドメインの依存方向に従う
   - **仕様の隙間を AI が発明した構造で埋めない**（理由: もっともらしい中間段階や一般論は、ドメインに根ざしておらず丸ごと棄却される）。推測した要素は stated（ユーザー/docs が明示したもの）と区別して明示し、ユーザー確認を取ってから実装する
   - **多重度を 1:1 と決め打たない**: エンティティ間の関連は「X は複数の Y を持ちうるか」(1:N) を確認してから設計する。モデル変更時は **波及先エンティティ**（同じ関連を持つ他モデル）への影響も surface する

1. **Research & Reuse** _(着手前・必須)_
   - **社内コードの既存 capability を先に確認:** 新しいデータ取得 (adapter / repository) や schema フィールドを足す前に、同じ情報源が既存層に無いか `rg` で確認する。新設する場合も「既存を再利用できない根拠」(取得経路が違う / 粒度が合わない 等) を持ってから着手する。
   - 新規実装の前に既存実装・ライブラリを調べ、80% 以上を満たすものは fork / port / wrap する。ハンドロールより実績あるライブラリを優先。ライブラリの API は Context7 や一次ドキュメントで確認する。

2. **Plan First**
   - 複雑な機能・リファクタは着手前に依存・リスク・フェーズ分割を洗い出す。

3. **TDD Approach**
   - テストを先に書く (RED → GREEN → refactor)。カバレッジは数値目標を追わず振る舞いがテストされているかで判断する ([common/testing.md](./testing.md))。

4. **Code Review** _(リスクベース)_
   - 実装のたびに機械的に起動しない。diff が下記のどれかに触れるときだけ `/code-review` skill を起動する (`.claude/skills/code-review/SKILL.md`):
     - **認可・越境**（Clerk の認証 / 所有者チェック / 他ユーザーのデータへのアクセス）
     - **不可逆なデータ操作**（migration / 削除 / 既存レコードの一括更新）
     - **並行性・状態遷移**（楽観的更新 / いいね等のカウンタ / リトライ）
     - **課金・外部 API のコスト構造**
   - 上記以外は自分のレビューで足りる。ユーザーが `/code-review` と言えばいつでも起動する。
   - 理由: モデルは指示しなくても自己検証・自己修正するので、一律の事前検証ステップは重複して過剰検証になる（Anthropic "Task scope and over-verification"）。一方 独立ベンチマークでは**ロジックエラー・並行性・API 誤用**の単発捕捉が弱いので、その領域と不可逆操作にだけゲートを残す。

5. **Commit & Push**
   - Detailed commit messages / conventional commits format。詳細は [git-workflow.md](./git-workflow.md)。

### 報告前の検証

手順の正本は `/pr`（`.claude/commands/pr.md`）。ここに残すのは、手順どおりに叩いても踏む罠だけ。

- **lint / 型チェックはリポジトリのルートで回す。** workspace の中だけで緑にして満足しない（理由: biome はルートから全 workspace を見るので、1 workspace だけで回して緑でも、ルートの `bun run lint` が他の場所の整形で落ちる）
- **OpenAPI schema を変えたら API 契約を再生成してコミットする。** backend の test / typecheck では契約 drift を検出できず、CI の「再生成ズレ検出」だけが落ちる。**zod schema を触らなくても、変えた定数がその schema の `example` に載るなら契約は動く**
- **CI の `run:` を足したら、その中身を `bash -e` で実行して確かめる。** Bash ツールは zsh なので、シェルの差がそのまま CI の失敗になる（実例: シェル変数に日本語を使い、zsh では通ったが bash は代入と解釈せず `exit 127`）。「同じつもりのコマンド」でなく workflow から抽出した実物を回す
- **レビュー用モック / レスポンスは現実の形を写す。** happy path だけでなく、現実に起きるエッジ形（複数ソースが同時にヒットする混在ケース / 空 / 矛盾）を再現する（理由: happy path のみのモックでは「本番で実際にどう表示されるか」を掴めず、UI 判断を誤る）
- frontend の React Doctor と dev server 実機確認は [react/coding-style.md](../react/coding-style.md) / [react/frontend-react.md](../react/frontend-react.md)

### 報告の忠実さ（全タスク共通）

- **「完了 / 緑 / 復旧」は、最後の編集の後に回した結果だけを根拠にする。** 途中で編集を足したら回し直す（理由: テストを足す前に回した緑をそのまま「backend typecheck 緑」と報告し、実際は型エラーが残っていた）
- **ジョブの成功ステータスを成果物の正しさの根拠にしない。** exit 0 / 200 は「処理が走った」であって「中身が正しい」ではない。成果物そのものを独立な手段で 1 件確認する
- **課金・不可逆を伴う一括処理は、1 件を完走させて成果物を検証してから残りを流す**
- **自分で書いた検証スクリプトの出力は、最初の 1 件だけ手で突き合わせる**（理由: ダンプスクリプトの演算子優先順位バグで「12 件すべて null」と誤報告した）
- **ユーザーが述べた固有名（ブランチ・環境・ID・ファイル名）を自分の前提で読み替えない。** 違和感があるなら確認するか聞く
