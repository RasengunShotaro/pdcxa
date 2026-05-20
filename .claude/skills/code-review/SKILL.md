---
name: code-review
description: ローカル変更 (git diff) を サブエージェントでレビューし、バグ・セキュリティ・品質問題を検出する。検出した懸念は必ずテストや実行で empirically 検証してから報告する。判断の余地がない自動修正可能なものは即修正、人間の判断が要るものはエスカレーションする。「コード実装が完了して報告する直前」が標準起動タイミング。ユーザーから /code-review と指示されたとき、または .claude/rules/common/development-workflow.md の Code Review ステップで起動。
---

# Code Review

ローカル変更を サブエージェントに渡してレビューさせる。**指摘は必ず実行で確認** してから報告する (推測のみの指摘は禁止)。

## いつ使うか

- **コード実装が完了し、ユーザーへ報告する直前** (development-workflow.md step 3 の自動起動ポイント)
- ユーザーから `/code-review` で明示起動されたとき
- バグ修正後、効果確認の最終チェックとして

スキップ可:

- 設定ファイルやドキュメントだけの変更 (ロジック無し)
  - "ロジック無し" の判定: `.md` / `.json` (lint/format 設定) / `.yml` (CI 設定) / `.gitignore` 等の純粋宣言ファイルのみで、コード (`.ts`, `.tsx`, `.js`, `.py` 等) の変更が 0 件であること。`.claude/rules/*.md` のような agent prompt も skip 対象 (ここでの "ロジック" はランタイムコードのみを指す)。**untracked も同じルールで判定** — ファイル内容を読む必要はなく拡張子で判定可
  - **自動起動 (development-workflow.md 経由)** → 黙って skip し `Code Review skipped: docs/config only` と 1 行報告
  - **明示起動 (`/code-review`)** → 「docs/config only ですがそれでもレビューしますか?」と user に確認して停止
    - ユーザー Y → ワークフロー §2 から再開（サブエージェント起動）
    - ユーザー N → `Code Review skipped: docs/config only (declined by user)` と 1 行返して終了
- すでに人間がレビュー済みの変更を再投入する場面

## ワークフロー

### 1. 差分を取得

```bash
git diff HEAD                              # staged + unstaged
git ls-files --others --exclude-standard   # untracked
```

untracked は `git diff --no-index /dev/null <file>` で diff 化して合算。**diff が空ならレビュー不要、即終了**。

### 2. サイズ確認

`git diff HEAD --stat` で規模を確認。**2000 行超** または **15 ファイル超** ならユーザーに「全部レビューする? 範囲を絞る?」と確認してから進める。盲目的に巨大 diff を投げない。

### 3. サブエージェント起動

`Agent` ツールで起動。`subagent_type: general-purpose`。プロンプトは下記テンプレートを `<DIFF>` 置換して渡す。

### 4. レポート処理

サブエージェントは **AUTO_FIX / ESCALATE / Skipped** の 3 セクションで返す。

> **役割分担**: reviewer サブエージェントは検証と提案までで止まる (本番コードを変更しない)。**AUTO_FIX を実ファイルに適用するのは main thread (本 skill を起動した側)** の責務。reviewer のレポートを受け取った main thread が下記に従い処理する。

- **AUTO_FIX**: 即適用。Edit で修正、テストが必要なら追加。**全 AUTO_FIX 適用後に必ずプロジェクトのテスト (`bun test` 等) を流し、緑であることを確認してから報告**。適用後、変更点を 1 行ずつ要約してユーザー報告。**指摘 5 件超なら一旦ユーザーに件数提示し、全適用 / 選択適用 / 後回し を聞く** ("件" = レポート上の AUTO_FIX 箇条書き 1 つ。本体修正と付随テスト追加をペアで含む 1 箇条書きは 1 件として数える)。
- **ESCALATE**: ユーザーに「この観点で判断要」と提示。選択肢があるなら列挙する。**勝手に修正しない**。
  - **ドメイン語で説明する**: reviewer から受け取った指摘がコード詳細寄り (変数名 / カラム名 / local 処理) で書かれていたら、main thread はユーザー報告前に **「業務シナリオ / 起こる事象 / 判断ポイント」の 3 段** に翻訳する。「`status` カラムが extracting で...」のような表現だけで上げない — ユーザーが「どんな操作で / どんなデータの動きで / どこに判断が必要か」を一読して理解できる粒度にする。判断材料が局所的すぎるとユーザーは判断できない
- **Skipped**: 「empirically 検証不能のため保留」として伝える。可能なら手動再検証、駄目なら user に丸投げ。

## レビュアーへのプロンプト (テンプレート)

````
あなたはシニアコードレビュアー。以下のローカル変更をレビューする。

## 検出対象

### バグ
- 論理エラー (off-by-one, null deref, 0 除算, 比較演算子の取り違え)
- ロジック欠落 (エッジケース未処理, early return 漏れ, 例外伝播経路)
- リソースリーク (未 close, unsubscribe 漏れ, transaction 未終了)

### セキュリティ
- 注入系: XSS, SQL injection, command injection, path traversal, prototype pollution
- 認証/認可: 境界の弱化, RBAC 漏れ, セッション管理の不備
- 秘密情報: ハードコードされた API key/password/token, エラー文への leak
- 入力バリデーション漏れ: 信頼できない入力 (HTTP body, file, 外部 API レスポンス, env) の未検証処理

### コード品質
- 可読性: 命名の弱さ, ネスト >4, 関数 >50 行, ファイル >800 行
- 保守性: 重複, 死コード, mutation, hidden side effects, 過剰な抽象化
- 型安全: `any` の濫用, narrowing 不足, 型と実装の乖離, 外部境界での型保証欠落

### テストの必要十分性
- 純粋関数のテスト欠落
- エッジケースのテスト漏れ (空文字, 巨大値, 不正型, undefined)
- 重要な振る舞いのテスト漏れ (例: エラー時の挙動)

### 日本語識別子の自然さ
- 関数名/型名/テスト名の日本語が、業務語として自然に読めるか (動詞句の体言止め `書類取込` のような曖昧な entity 名は flag)
- ドメイン関数名に目的語が含まれるか (`プロジェクト配下を集計する` のように動詞だけは曖昧)
- 英語クラス名の機械的な訳語ではなく、PdM や現場担当者が読んで通じる語か
- 詳細: `.claude/rules/typescript/coding-style.md` の「命名規律」セクション

## 適用する規約

以下を Read してから判断する (CLAUDE_PROJECT_DIR 相対):
- .claude/rules/common/coding-style.md
- .claude/rules/common/testing.md
- .claude/rules/common/security.md
- .claude/rules/typescript/coding-style.md
- .claude/rules/typescript/testing.md

## 検証 (最重要・絶対遵守)

**バグ・セキュリティの指摘は必ず実行で確認すること**。読んで「ぽい」だけで報告するのは禁止。

検証手段の例:
- バグ: 失敗を再現するテストを書いて流す → 失敗確認できれば確定、通ったら誤検知。プロジェクトのテストランナー (`bun test` 等) を使う。
- SQL injection: payload を組んでクエリ生成関数に渡し、生成 SQL を確認。
- XSS: payload を入力としてレンダリング結果を確認 (HTML エスケープ漏れ)。
- command injection: `; whoami` 系の payload で実行コマンドを確認。
- 型エラー: `bunx tsc --noEmit` を該当範囲で実行。
- 入力バリデーション漏れ: 異常値 (空文字, 巨大値, 不正型, undefined) を渡して挙動確認。

**コード品質指摘 (可読性・保守性) は実行検証不要**。規約と diff だけで判断可。

検証不能なもの (本番負荷でしか出ない race condition など) は **Skipped セクションに回す**。憶測で AUTO_FIX / ESCALATE に上げない。

## 分類: AUTO_FIX か ESCALATE か

軸は **判断の余地** (重要度ではない)。0 除算は CRITICAL でも自動修正できるが、DB schema 変更は人間判断要。

### ESCALATE (人間の判断要)
- **不可逆操作**: DB schema 変更, migration, 既存レコード更新, index drop, ファイル削除
- **コスト発生**: 課金 API 呼び出し増, 有料 SDK 追加, batch サイズ拡大, instance scale
- **インフラ・運用**: Docker / CI / IAM / network rule / secret rotation 戦略
- **外部契約の breaking change**: public API response shape, webhook, 共有型の破壊
- **セキュリティ方針**: auth 境界変更, CORS, rate limit 閾値, PII ログ可否
- **ビジネスロジックの仕様解釈**: エラー時挙動 (無視/失敗/リトライ), お金の丸め, 状態遷移条件 が diff から一意に読めない
- **アーキテクチャ逸脱**: 新規依存パッケージ, BC 越境, レイヤ違反 (intentional な可能性あり)
- **互換性・移行戦略**: deprecation timing, feature flag, rollback 計画
- **機能削除**: コード/テスト/ファイル削除 (意図確認必須)
- **新規 env var / config**: required? default? 読み込み箇所?
- **ユーザー向け文言**: エラーメッセージ, 通知, ラベル

### AUTO_FIX (正解が一意)
- **明らかなバグ**: 0 除算, null deref, off-by-one, 比較演算子の取り違え, リテラル typo
  - ただし「既存コードを編集する形での比較演算子変更」(`>` → `>=` 等) で **数値出力に差は無いが契約定義が変わる** ようなケースは仕様解釈マターとみなし ESCALATE。判別: コミットメッセージや併設テストから "typo の修正" であることが明示されていれば AUTO_FIX、そうでなければ ESCALATE。
- **mechanical な規約違反**: mutation→immutable, 関数 50 行超 → 抽出, `any` を locally 推論可能な型に
- **純粋関数のテスト欠落**: 入出力が一意で挙動議論の余地が無いケース
- **既存 schema を通すだけの validation 追加**
- **dead code / unused import**: 確実に未使用
- **プロジェクト定型の error handling**: 既存パターン (Effect-TS 等) を機械適用
- **命名・コメントの cleanup**

### 迷ったら
**ESCALATE 寄り**。「自分が勝手に直して、後で diff を見たユーザーが驚かないか」が判定基準。驚きそうなら聞く。

## 出力フォーマット (厳守)

以下の Markdown で返す。指摘なしのセクションは "なし" とだけ書く。

```markdown
# Code Review Report

## AUTO_FIX
- `path/to/file.ts:42` — 簡潔な説明
  - 検証: 例) `path/to/file.test.ts` に再現テスト追加 → `divide(1, 0)` で `Infinity` を返すことを確認
  - 修正方針: 例) `if (b === 0) return Effect.fail(new DivideByZero())` を関数頭に追加

## ESCALATE
- `path/to/file.ts:88` — 簡潔な説明 (1 行で「ユーザー操作 / データの動き / 起こる事象」のどれが論点か明示)
  - 業務シナリオ: ユーザーがどういう操作をすると、どこにデータが流れて、何が起きるか (ドメイン語で書く。「`status` カラムが ...」のような実装詳細だけで終わらせない)
  - 起こる事象: 上記シナリオで実害として何が見えるか (ユーザーが画面上で何を体験するか / コスト / データ汚染 / セキュリティ穴 など)
  - 検証: 例) `userId="'; DROP TABLE--"` を渡すと組まれる SQL が `WHERE id = '; DROP TABLE--'` になることを確認
  - 判断要因: セキュリティ方針 / 外部契約変更
  - 選択肢: A) prepared statement に切替, B) input を strict whitelist で制限

## Skipped
- `path/to/file.ts:120` — 簡潔な説明
  - 理由: 並行アクセスでしか再現しないため empirical 検証不可
```

### Skip 時 (docs/config only など、レビュー自体を行わなかった場合)

`# Code Review Report` フォーマットは出さず、以下のいずれかの 1 行で返す:

- 自動起動時: `Code Review skipped: <理由>` (例: `Code Review skipped: docs/config only`)
- 明示起動時: ユーザーへの確認文 (例: `現状の diff は docs/config only ですが、レビューを実施しますか? (Y: 実施 / N: skip)`)

## 注意 (reviewer のあなた向け)

- **あなたは検証と提案までしか行わない**。本番コードの修正は main thread が後段で AUTO_FIX を見て適用する。Read / Bash のみで検証し、`Edit` / `Write` を本番ファイルに対して呼ばないこと。
- 検証用の一時ファイル (`/tmp/<dir>/*` 等) を作る場合は明示的に作り、終了時に明示的に削除する。本番コードに verify スクリプトを残さない。
- 実行コマンドはプロジェクトのもの (`bun test`, `bunx tsc --noEmit` 等) を使う。`package.json` / `CLAUDE.md` で把握する。
- 対象ファイルが test runner で再現困難な場合のみ、temp script (`node /tmp/.../verify.mjs`) で関数挙動を再現してよい。実 DB / 外部 API は叩かない。

## 対象 diff

<DIFF>
````

## エッジケース

- **既に commit 済みで diff が空**: ユーザーに「どの ref 範囲をレビューしたい?」と確認 (例: `git diff main...HEAD`, `git diff HEAD~1`)。
- **diff が docs/config only**: 「いつ使うか」の skip 判定フローに従う (自動起動なら 1 行 skip 報告 / 明示起動ならユーザー確認)。
- **サブエージェント空応答**: タイムアウトの可能性。ユーザーに失敗を報告し再実行を提案する。**失敗を黙って成功扱いにしない**。
- **`Agent` tool が利用不可な環境** (subagent コンテキストから呼ばれた等): 自分で reviewer を兼任しない (バイアスが入る)。skill 起動を中断し、`Code Review aborted: Agent tool unavailable in this context. Re-run /code-review from main thread.` とユーザーに報告して終了する。
- **AUTO_FIX を全適用したらテストが落ちた**: ロールバックし、AUTO_FIX を 1 件ずつ適用→テスト実行で犯人を特定、該当 fix だけ ESCALATE に降格してユーザーに状況を伝える。
- **検証で副作用 (DB 書き込み等) が発生しそうなとき**: サブエージェントは検証を中止し Skipped に回す。レビュアーが本番 DB を汚染しないよう徹底する。
