---
name: code-review
description: ローカル変更 (git diff) を 観点別の並列サブエージェント (コード/セキュリティ/テスト/可読性/仕様) でレビューし、人間判断 (ESCALATE) 以外の指摘が出なくなるまで反復する。各指摘は必ずテストや実行で empirically 検証してから報告する。判断の余地がない自動修正可能なものは即修正、人間の判断が要るものはエスカレーションする。「コード実装が完了して報告する直前」が標準起動タイミング。ユーザーから /code-review と指示されたとき、または .claude/rules/common/development-workflow.md の Code Review ステップで起動。
---

# Code Review

ローカル変更を **5 つの観点別 reviewer サブエージェントに並列でレビューさせ**、AUTO_FIX を適用しては再レビューを回し、**人間判断 (ESCALATE) 以外の新規指摘が出なくなるまで反復**する。1 エージェントに全観点を詰めると context 肥大で見落とすため、観点を分割する。**指摘は必ず実行で確認** してから報告する (推測のみの指摘は禁止)。

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

- **コード実装が完了し、ユーザーへ報告する直前** (development-workflow.md step 4 の自動起動ポイント)
- ユーザーから `/code-review` で明示起動されたとき
- バグ修正後、効果確認の最終チェックとして

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

`git diff HEAD --stat` で規模を確認。**2000 行超** または **15 ファイル超** ならユーザーに「全部レビューする? 範囲を絞る?」と確認してから進める。盲目的に巨大 diff を投げない。

### 3. 並列レビュー (1 ラウンド)

`Agent` ツール (`subagent_type: general-purpose`) で **5 dimension を 1 メッセージ内で並列起動** する (independent なので必ず並列。逐次にしない)。各 reviewer には下記テンプレートを `{DIM}` / `{DIM_FILE}` / `{DIFF}` 置換して渡す。

**dimension の取捨**: 原則 5 つ全部走らせる (見落とし防止が目的)。ただし対象 diff に **UI / frontend 変更が一切無い** なら可読性は naming のみ・仕様は API 動線のみに自然と縮む (reviewer 側が "なし" を返す)。明確に無関係な dimension を省いて節約したいときは、省いた dimension を最終報告に 1 行明記する (黙って省かない)。

```
あなたは {DIM} 観点専任のコードレビュアー。以下のローカル変更を、{DIM} の観点だけでレビューする。

まず次を Read してルールを把握する (CLAUDE_PROJECT_DIR 相対):
- .claude/skills/code-review/references/review-contract.md  (検証・分類・出力フォーマットの共通契約)
- {DIM_FILE}                                                (この観点の検出対象・検証手段・読むべき rules)

review-contract.md の指示に厳密に従う:
- 担当 dimension の指摘だけ出す (他観点は別の reviewer が並列で見ている)
- バグ・セキュリティ・仕様の指摘は必ず実行で検証する。検証できないものは Skipped
- 本番ファイルを Edit/Write しない (適用は呼び出し元の責務)
- review-contract.md の「出力フォーマット」通りに返す

## 対象 diff

{DIFF}
```

> **役割分担**: 各 reviewer は検証と提案までで止まる (本番コードを変更しない)。**AUTO_FIX を実ファイルに適用するのは main thread (本 skill を起動した側)** の責務。

### 4. 集約 → AUTO_FIX 適用 → 反復

5 つのレポートが返ったら main thread が処理する。

**4a. 統合 (dedup)**: 同じ `file:line` × 同じ事象の指摘が複数 dimension から出たら 1 件にマージ (どの観点が指摘したか併記)。深刻度が割れたら **高い方** を採用。

**4b. AUTO_FIX 適用**: AUTO_FIX を Edit で適用、必要なら付随テストを追加。**全適用後に必ずプロジェクトのテスト (`bun run test` 等) を流し、緑を確認**。
- **AUTO_FIX が 5 件超**なら、適用前に件数をユーザーに提示し 全適用 / 選択適用 / 後回し を聞く ("件" = レポート上の AUTO_FIX 箇条書き 1 つ。本体修正と付随テストのペアで 1 件)。
- 全適用したらテストが落ちた場合: ロールバックし、1 件ずつ適用→テスト実行で犯人を特定、該当 fix だけ ESCALATE に降格してユーザーに状況を伝える。

**4c. 反復 (収束ループ)**: AUTO_FIX を 1 件でも適用したら、**更新後の diff で §3 をもう一度回す**。理由は 2 つ — (1) 1 回のレビューでは見落としが起きる、(2) 修正が新たな問題を生むことがある。

**再実行は §3 の全 dimension で回す — 前ラウンドで指摘が出た観点だけに狭めない。** 振る舞いを変える修正 (楽観ロック追加・分岐変更・状態遷移の変更等) は、前ラウンドで "なし" を返した観点 (セキュリティ / テスト等) から新たに指摘を生む。「指摘のあった N 観点だけ再レビューして収束」は**収束の偽装で禁止**。§3 の "dimension の取捨" は UI / frontend 無関係などの理由でのみ許され、"前回指摘が無かった" は省略理由にならない。

ループの停止条件 (いずれか):
- あるラウンドで **新規の AUTO_FIX が 0 件** になった (= ESCALATE / Skipped / 指摘なし だけになった) → **収束。これがゴール**
- **3 ラウンド** 回した (循環ブレーカー。トークン浪費と振動を防ぐ)
- **停滞**: 2 ラウンド連続で同じ指摘が AUTO_FIX↔未解決 を往復している (適用しても消えない) → そのままループを止め、その指摘を ESCALATE に上げて人間に委ねる

ESCALATE / Skipped はラウンドをまたいで **累積・dedup** し、ループを再起動しない (人間が決めるもの)。各ラウンドで新規に出た ESCALATE のみ追記する。

### 5. 最終報告

収束 (または打ち切り) したら main thread がユーザーに報告する。

- **適用した AUTO_FIX**: ファイル単位で変更点を 1 行ずつ要約。最後にテストが緑であることを明記。
- **ESCALATE**: ユーザーに「この観点で判断要」と提示。**勝手に修正しない**。各件は必ずこの順で書く — 変数名から書き始めない:
  1. **どの設計判断か** (ドメイン語の一行見出し。例: 「申請却下時に提出済み書類を残すか破棄するか」)
  2. **どういう状況で何が起きるか** (業務上の流れ → 現状の diff だとその状況で実際に何が起きるか。業務インパクトで語る)
  3. **判断ポイントと選択肢** (人間に何を決めてほしいか)
  4. 該当 `file:line` と検証根拠 (1〜3 の裏付けとして最後に添える)
  - reviewer の文面がコード詳細寄り (変数名 / カラム名 / local 処理) なら、**この 4 段に翻訳してから出す**。「`status` カラムが extracting で...」のまま上げない。ユーザーがコードを開かずとも「どんな操作で / どんなデータの動きで / どこに判断が要るか」を一読で掴める粒度にする。
  - **変数名・命名・実装の言い回しそのものを論点にした ESCALATE は出さない** (どう扱うべきか業務的に決まらない設計・仕様判断だけが ESCALATE)。reviewer がそれを上げてきたら、設計判断に翻訳できなければ落とす。
- **Skipped**: 「empirically 検証不能のため保留」として伝える。可能なら手動再検証、駄目なら user に委ねる。
- **メタ情報**: 回したラウンド数、省いた dimension があればその旨を 1 行で添える。

### Skip 時 (docs/config only など、レビュー自体を行わなかった場合)

`# Code Review Report` フォーマットは出さず、以下のいずれかの 1 行で返す:

- 自動起動時: `Code Review skipped: <理由>` (例: `Code Review skipped: docs/config only`)
- 明示起動時: ユーザーへの確認文 (例: `現状の diff は docs/config only ですが、レビューを実施しますか? (Y: 実施 / N: skip)`)

## エッジケース

- **既に commit 済みで diff が空**: ユーザーに「どの ref 範囲をレビューしたい?」と確認 (例: `git diff main...HEAD`, `git diff HEAD~1`)。空 diff を黙ってレビュー成功扱いにしない。
- **diff が docs/config only**: 「いつ使うか」の skip 判定フローに従う。
- **一部 dimension の reviewer が空応答 / タイムアウト**: その dimension だけ再実行する。**直らなければ、どの観点が未検証かを最終報告に明記**する (失敗を黙って成功扱いにしない)。他 dimension の結果は活かす。
- **`Agent` tool が利用不可な環境** (subagent コンテキストから呼ばれた等): 自分で reviewer を兼任しない (バイアスが入る)。skill 起動を中断し、`Code Review aborted: Agent tool unavailable in this context. Re-run /code-review from main thread.` と報告して終了する。
- **3 ラウンドで収束しない**: 残った未解決指摘を ESCALATE として人間に提示し、「自動収束に至らず打ち切り」と明記する。無限ループに入らない。
- **検証で副作用 (DB 書き込み等) が発生しそうなとき**: reviewer は検証を中止し Skipped に回す。本番 DB を汚染しない。
