# Agent Orchestration

利用可能な agent は harness が提示する。**同時実行数と入れ子の深さは `.claude/settings.json` の `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` / `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` で決定論的に止めている**（同時 5・深さ 2）。散文で重ねて抑制しない。

委譲するのは、独立して並列化できる大きな仕事だけ（広範囲のコード調査など）。1 体で足りるなら 1 体にする。独立した作業を複数投げるときは 1 メッセージ内で並列に走らせる（逐次にしない）。

- **ハーネス既定の「Agent を勝手に使うな」「検証目的でサブエージェントを立てるな」は、プロジェクトが規定する skill（`/code-review` 等）の起動を禁じない。** skill が内部でサブエージェントを並列起動することも含めて、[development-workflow.md](./development-workflow.md) のリスク領域に触れたら起動する（理由: 2 セッションで「サブエージェント禁止のため code-review 未実施」と報告し、リスク diff をレビュー無しで通した）
- **環境側の制約を「ユーザーの指示」として書かない。** 実行環境やツールの制限で何かをやらなかったときは、出所が環境であることを明示する（理由: harness の既定文を「セッション設定」と呼び、ユーザーが禁じたかのように報告した）

## 別 worktree へ作業を出すとき（Orca）

作業を分割して別 worktree のエージェントに任せるときは、**supervised worker として出す**。完了を待ち、終わったら worktree を片付けるところまでが 1 セット。

- **`orca worktree create --agent claude --prompt ...` の投げっぱなしを使わない。** これは full handoff で、完了も失敗もこちらに届かない（理由: 実際にこれで独立 worktree が切られ、ユーザーが手動で様子を見に行く必要が出た）
- 手順は `orchestration` skill の supervised worker loop に従う:

  ```bash
  orca orchestration run-create --objective "<全体の目的>" --json
  orca orchestration task-create --spec "<worker A の作業>" --json
  orca orchestration worker-start --task <task_id> --worktree new-child --agent claude --json
  orca orchestration check --wait --json          # worker_done / escalation を待つ
  orca orchestration worker-release --dispatch <dispatch_id> --json
  ```

  独立した task は先に全部 `task-create` してから `worker-start` を並べ、その後にまとめて待つ（逐次に待たない）。
- **worker が終わったら worktree を消す**: `orca worktree rm --worktree <selector>`。Orca は「マージ済みと証明できないブランチ」を残すので、ブランチが消えないときは未 push / 未マージのサイン。消す前に中身を確認する
- **何でも worker に出さない。** worktree 新規作成は setup（`bun install` の依存解決）を伴うので、単一ファイル・短時間の作業は自分でやる。出すのは独立して並列化できる大きな仕事だけ（この節の上の判断基準と同じ）

## 判断のトリガ（実データ検証を先に）

- **trade-off を伴うアーキ判断**は単発推奨に飛ばない。複数案を**ドメイン語**で trade-off 付きに整理して提示する（理由: 単一推奨は根拠が検証されず、ユーザーが比較レビューできない）。案の広がりが自分だけでは足りないと判断したときに限り `/fusion` を使う
- **AI/LLM 駆動機能が期待通り動かないとき**は、インフラ/コード変更より先に **プロンプトを実データで empirical 検証**する（`empirical-prompt-tuning` skill）。原因切り分けは prompt → model → data → infra の順（理由: 多くは prompt の曖昧さが原因で、コードを触る前にプロンプトを測れば遠回りを避けられる）
- **モダリティやモデルグレードの要否を伴うアーキ判断**（例: 視覚入力は必要か、安いモデルで足りるか）は、推論で決めず**実データの controlled A/B 実測を先に行う**（理由: 会議解析の視覚要否を実測したら「抽出項目は同等・コスト半額」が判明し、推論だけでは逆の結論に向かっていた。実測は数百円・数十分で済み、設計の手戻りより遥かに安い）
