---
name: code-review
description: ローカル変更 (git diff) を 1 体の reviewer サブエージェントが 5 観点 (コード/セキュリティ/テスト/可読性/仕様) で 1 パスレビューする。各指摘は実行で empirically 確認してから報告する。判断の余地がない自動修正可能なものは即修正、人間の判断が要るものはエスカレーションする。ユーザーから /code-review と指示されたとき、または .claude/rules/common/development-workflow.md の Code Review ステップが挙げるリスク領域 (認可・越境 / 不可逆データ操作 / 並行性・状態遷移 / 課金) に diff が触れるときに起動。
---

# Code Review

ローカル変更を **1 体の reviewer サブエージェントに 5 観点すべてでレビューさせ**、返ってきた AUTO_FIX を適用してテスト緑を確認し、報告する。**1 パスで終える** (再レビューのループは回さない)。reviewer は疑いを網羅的に出し、実行で確かめたものだけを AUTO_FIX / ESCALATE、確かめきれないものを確信度付きの Skipped に分ける。絞り込みは main thread が §4c で行う。

5 つの観点 (dimension):

| dimension | 見るもの | 詳細ファイル |
|---|---|---|
| コード | バグ・型安全・保守性・性能・既存資産の再利用 | `references/dimensions/correctness.md` |
| セキュリティ | 注入・認可・越境・秘密情報・依存 | `references/dimensions/security.md` |
| テスト | カバレッジの十分性・テスト品質 | `references/dimensions/testing.md` |
| 可読性 | 日本語の自然さ・技術語のフロント流出・コメント方針 | `references/dimensions/readability.md` |
| 仕様 | 動線をシミュレートし振る舞いを empirical に検証 | `references/dimensions/spec.md` |

共通の検証ルール・AUTO_FIX/ESCALATE 分類・出力フォーマットは `references/review-contract.md`。

## いつ使うか

- ユーザーから `/code-review` で明示起動されたとき
- diff が development-workflow.md step 4 のリスク領域に触れるとき — **認可・越境 / 不可逆なデータ操作 / 並行性・状態遷移 / 課金・外部 API コスト**

実装のたびに機械的に起動しない (一律の事前検証はモデル自身の自己検証と重複する)。上記リスク領域を残すのは、単発レビューが**ロジックエラー・並行性・API 誤用**を取りこぼしやすく、かつそこが本番で最も高くつくため。

スキップ可:

- 設定ファイルやドキュメントだけの変更 (ロジック無し)
  - "ロジック無し" の判定: `.md` / `.json` (lint/format 設定) / `.yml` (CI 設定) / `.gitignore` 等の純粋宣言ファイルのみで、コード (`.ts`, `.tsx`, `.js`, `.py` 等) の変更が 0 件であること。`.claude/rules/*.md` のような agent prompt も skip 対象 (ここでの "ロジック" はランタイムコードのみを指す)。**untracked も同じルールで判定** — 拡張子で判定可
  - **自動起動 (development-workflow.md 経由)** → 黙って skip し `Code Review skipped: docs/config only` と 1 行報告
  - **明示起動 (`/code-review`)** → 「docs/config only ですがそれでもレビューしますか?」と user に確認して停止
    - ユーザー Y → ワークフロー §3 から再開
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

`git diff HEAD --stat` で規模を確認。一括リネームや生成物の再生成で 200 ファイルを超えるような diff のときだけ、ユーザーに「全部レビューする? 範囲を絞る?」と確認する (理由: reviewer に丸ごと渡すとコストが膨らむ割に、機械的な変更からは指摘がほぼ出ない)。

### 3. レビュー

`Agent` ツール (`subagent_type: general-purpose`, **`model: "opus"` を必ず付ける**) で reviewer を **1 体** 起動する。reviewer には下記テンプレートを `{DIFF}` 置換して渡す。

> `model` を省くと既定のサブエージェントモデルに落ちる。ロジックエラー・並行性・API 誤用の捕捉率がこの skill の存在理由なので、reviewer は opus で回す。既定モデルで走り出していることに気づいたら止めて起動し直す。

```
あなたはコードレビュアー。以下のローカル変更を、5 つの観点 (コード / セキュリティ / テスト / 可読性 / 仕様) すべてでレビューする。

まず次を Read してルールを把握する (CLAUDE_PROJECT_DIR 相対):
- .claude/skills/code-review/references/review-contract.md  (検証・分類・出力フォーマットの共通契約)
- .claude/skills/code-review/references/dimensions/ 配下の全ファイル (各観点の検出対象・検証手段・読むべき rules)

review-contract.md に従う:
- 5 観点すべての指摘を 1 つのレポートに出す。各指摘にどの観点かを併記する
- この段の目的は網羅。疑いは確信度・深刻度が低くても落とさない (絞り込みは呼び出し元が行う)
- バグ・セキュリティ・仕様の指摘は実行で確かめたものを AUTO_FIX / ESCALATE、確かめきれないものを確信度付きで Skipped に出す
- 本番ファイルを Edit/Write しない (適用は呼び出し元の責務)
- review-contract.md の「出力フォーマット」通りに返す

## 対象 diff

{DIFF}
```

> **役割分担**: reviewer は検証と提案までで止まる (本番コードを変更しない)。**AUTO_FIX を実ファイルに適用するのは main thread (本 skill を起動した側)** の責務。

### 4. 集約 → AUTO_FIX 適用

レポートが返ったら main thread が処理する。**1 パスで終える** — 修正後の再レビューも、findings を反証する専任 subagent も立てない (モデル自身が行う自己検証と重複し、トークンを食う割に品質が上がらない)。

**4a. 統合 (dedup)**: 同じ `file:line` × 同じ事象の指摘が複数観点にまたがって出ていたら 1 件にマージ (どの観点が指摘したか併記)。深刻度が割れたら **高い方** を採用。

**4b. AUTO_FIX 適用**: AUTO_FIX を Edit で適用、必要なら付随テストを追加。**全適用後に必ずプロジェクトのテスト (`bun run test` 等) を流し、緑を確認**。
- 全適用したらテストが落ちた場合: ロールバックし、1 件ずつ適用→テスト実行で犯人を特定、該当 fix だけ ESCALATE に降格してユーザーに状況を伝える。

**4c. 判定の精査**: AUTO_FIX を適用し終えたら、残った `[高]` finding・ESCALATE・Skipped を自分で読み直し (Skipped は確信度と深刻度で順位付けする)、**到達不能パス / 既に別所で処理済み / 杞憂** のものを落とす。落とした `[高]` は「誤検知と判断・除外」の 1 行を §5 メタに残す (黙って消さない)。断定できないものは残す (fail open。消し過ぎない)。反証専任の subagent は立てない。

### 4d. ワーキングツリー回収 (報告前・必須)

reviewer は検証のため一時ファイルを作ったり本番ファイルを一時的に mutate したりする (review-contract.md はそれを終了時に削除・復元するよう求めているが、**サブエージェントは終了時に死ぬので後片付けを取りこぼす**。backend は import 解決のため repo 内に検証ファイルを置かざるを得ず `/tmp` 制約が守られないこともある)。**回収責任は親 (main thread) が持つ**。報告 (§5) の前に必ず:

```bash
git status --short   # stray な検証生成物・意図しない tracked 変更を洗い出す
```

- **untracked の検証ゴミ** (`__sc_*` / `*debug*` / `*scratch*` / `*tmp*` / `_validate_*` 等、AUTO_FIX 由来でないもの) → 削除する。
- **tracked ファイルの意図しない変更** (reviewer が検証で mutate した本番関数の書き戻し漏れ等、AUTO_FIX でも意図した編集でもないもの) → `git checkout -- <file>` で HEAD から復元する。
- 判別に迷う変更は削除・復元せず ESCALATE に回してユーザーに確認する (AUTO_FIX と検証ゴミを取り違えて消さない)。

理由: この掃除を怠ると検証用スタブが成果物として残り、biome Stop hook でしか気づけず、PR diff にも混入する (複数セッションで再発)。

### 5. 最終報告

AUTO_FIX の適用と精査が終わったら main thread がユーザーに報告する。

- **適用した AUTO_FIX**: ファイル単位で変更点を 1 行ずつ要約。最後にテストが緑であることを明記。
- **ESCALATE**: ユーザーに「この観点で判断要」と提示。**勝手に修正しない**。各件は必ずこの順で書く — 変数名から書き始めない:
  1. **どの設計判断か** (ドメイン語の一行見出し。例: 「申請却下時に提出済み書類を残すか破棄するか」)
  2. **どういう状況で何が起きるか** (業務上の流れ → 現状の diff だとその状況で実際に何が起きるか。業務インパクトで語る)
  3. **判断ポイントと選択肢** (人間に何を決めてほしいか)
  4. 該当 `file:line` と検証根拠 (1〜3 の裏付けとして最後に添える)
  - reviewer の文面がコード詳細寄り (変数名 / カラム名 / local 処理) なら、**この 4 段に翻訳してから出す**。「`status` カラムが extracting で...」のまま上げない。ユーザーがコードを開かずとも「どんな操作で / どんなデータの動きで / どこに判断が要るか」を一読で掴める粒度にする。
  - **変数名・命名・実装の言い回しそのものを論点にした ESCALATE は出さない** (どう扱うべきか業務的に決まらない設計・仕様判断だけが ESCALATE)。reviewer がそれを上げてきたら、設計判断に翻訳できなければ落とす。
- **Skipped**: 「empirically 検証不能のため保留」として伝える。可能なら手動再検証、駄目なら user に委ねる。
- **メタ情報**: §4c で誤検知として除外した `[高]` finding があればその件数と理由を 1 行で添える。

### Skip 時 (docs/config only など、レビュー自体を行わなかった場合)

`# Code Review Report` フォーマットは出さず、以下のいずれかの 1 行で返す:

- 自動起動時: `Code Review skipped: <理由>` (例: `Code Review skipped: docs/config only`)
- 明示起動時: ユーザーへの確認文 (例: `現状の diff は docs/config only ですが、レビューを実施しますか? (Y: 実施 / N: skip)`)

## 改訂 (この skill を直すとき)

回帰シナリオを `references/evals.md` に 4 本固定してある (明白バグ→AUTO_FIX / 仕様解釈→ESCALATE / docs-only→skip / 検証しきれない疑い→Skipped)。この skill を改訂したら `empirical-prompt-tuning` skill でそれらを回し、分類・検出の退行が無いか確認する。**通常のレビュー実行時はこのファイルを読み込まない** (改訂時のみ)。

## エッジケース

- **既に commit 済みで diff が空**: ユーザーに「どの ref 範囲をレビューしたい?」と確認 (例: `git diff main...HEAD`, `git diff HEAD~1`)。空 diff を黙ってレビュー成功扱いにしない。
- **diff が docs/config only**: 「いつ使うか」の skip 判定フローに従う。
- **reviewer が空応答 / タイムアウト / 一部の観点を返さない**: 欠けた観点だけを指定して reviewer を再実行する。**直らなければ、どの観点が未検証かを最終報告に明記**する (失敗を黙って成功扱いにしない)。返ってきた観点の結果は活かす。
- **`Agent` tool が利用不可な環境** (subagent コンテキストから呼ばれた等): 自分で reviewer を兼任しない (バイアスが入る)。skill 起動を中断し、`Code Review aborted: Agent tool unavailable in this context. Re-run /code-review from main thread.` と報告して終了する。
- **検証で副作用 (DB 書き込み等) が発生しそうなとき**: reviewer は検証を中止し Skipped に回す。本番 DB を汚染しない。
- **レビュー中に本体編集を並行させない**: reviewer サブエージェント (検証で `git stash` / 一時ファイル作成 / mutate を行う) と main thread のファイル編集を**同一ワーキングツリーで並行**させると、「File has been modified since read」や gitleaks/biome Stop hook の点滅が起きる。レビューは実装が一段落した後のフェーズとして回す (編集と時間分離)。どうしても並行させたいなら reviewer を worktree 隔離で走らせる。Stop hook/lint の "失敗" が点滅したら、まず並行プロセスがツリーを書き換えていないかを疑う (設定追加で黙らせる前に)。
