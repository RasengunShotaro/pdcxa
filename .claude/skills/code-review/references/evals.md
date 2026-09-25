# code-review 回帰シナリオ (改訂時のみ)

この skill を改訂したら `empirical-prompt-tuning` skill でこの 4 本を回し、分類・検出の退行を測る。専用の実行ランナーは無い (Anthropic 公式どおり eval は author が回す source of truth)。**通常のレビュー実行時にこのファイルは読まない。**

各シナリオは「与える diff の状況」と「期待する分類挙動」の対。精度 = 達成した expected_behavior 項目 / 全項目。`[critical]` が 1 つでも落ちたら失敗。

## S1. 明白バグ (→ AUTO_FIX 検出)

- 状況: 純粋関数に 0 除算 / off-by-one / 比較演算子の取り違えを 1 つ含む TS diff (併設テストなし)。UI 変更なし。
- expected_behavior:
  1. [critical] correctness reviewer がそのバグを検出し AUTO_FIX に分類する
  2. 再現テストを書いて実行し、empirical に確定してから上げている (推測で上げていない)
  3. 仕様解釈の余地が無いため ESCALATE を無で返す
  4. docs/config でないので skip しない

## S2. 仕様解釈が要る変更 (→ ESCALATE)

- 状況: 申請却下時に提出済み書類を物理削除する分岐を追加する diff。削除が意図的か仕様から一意に読めない。
- expected_behavior:
  1. [critical] spec または correctness reviewer が「削除の是非」を ESCALATE に分類する
  2. ESCALATE がドメイン語の 4 段 (設計判断 → 状況 → 何が起きるか → 判断ポイント) で書かれ、変数名から始まっていない
  3. 勝手に AUTO_FIX で削除を書き換えていない
  4. §4c の精査で「到達可能な業務状況」として残る

## S3. docs/config only (→ skip)

- 状況: `.md` と CI `.yml` のみの diff。ランタイムコード 0 件。
- expected_behavior:
  1. [critical] レビューを実行せず skip する
  2. 自動起動なら `Code Review skipped: docs/config only` の 1 行、明示起動なら確認文を返す
  3. reviewer の subagent を起動しない

## S4. 検証しきれない疑い (→ Skipped に残る)

- 状況: 同じ item を読んでから条件なしで書き戻す read-modify-write を、非同期ワーカーの処理に追加する diff。並行実行でしか競合が再現しない。
- expected_behavior:
  1. [critical] correctness reviewer が競合の疑いを黙って落とさず、確信度付きで Skipped に出す
  2. 再現できていないので AUTO_FIX / ESCALATE には上げていない
  3. §4c の精査後も最終報告の Skipped に残る (到達可能な経路なので消さない)
