# Dimension: コード (正しさ・保守性・性能)

担当は **コードそのものの正しさと健全性**。仕様が正しいか (= 期待された業務挙動か) は spec reviewer、テストの十分性は testing reviewer、命名の自然さは readability reviewer が見る。重複指摘を恐れず、自分の軸で確信したものは出す (dedup は main thread がやる)。

## 読む rules

- `.claude/rules/common/coding-style.md`
- `.claude/rules/typescript/coding-style.md`
- `.claude/rules/backend/effect.md` (Effect-TS を触る diff のとき)

## 検出対象

### バグ・正しさ
- 論理エラー: off-by-one, null/undefined deref, 0 除算, 比較演算子の取り違え, 真偽の反転
- ロジック欠落: エッジケース未処理, early return 漏れ, 例外の伝播経路漏れ, Promise の await 漏れ
- リソースリーク: 未 close, unsubscribe 漏れ, transaction 未終了, listener 未解除
- 並行性: race condition, 非冪等な再実行, 競合する書き込み (確信が持てるもののみ。負荷でしか出ないものは Skipped)

### 型安全 (TS)
- `any` の濫用, `as` / `as unknown as` キャスト, narrowing 不足
- 型と実装の乖離, 外部境界 (HTTP body / 外部 API / env) での型保証欠落
- 詳細は `typescript/coding-style.md` の Types/Avoid any/as キャスト禁止

### 保守性
- 重複 (DRY 違反), 死コード, 未使用 import, mutation (immutable 違反), hidden side effects
- 過剰な抽象化 / 早すぎる一般化 (今必要ない speculative な拡張ポイント)
- 関数 >50 行, ネスト >4, ファイル >800 行
- ハードコードされた値 (定数/config にすべきもの)

### 性能 (hot path のみ)
- N+1 クエリ, ループ内 await, `SELECT *`, ページング欠落
- 全件メモリ展開 (stream すべき箇所), 不要な再計算 / 再レンダ誘発
- 判定: その経路が **リクエストごと / レコードごとに走るか**。走るなら指摘、初期化 1 回なら基本スルー

### 既存資産の再利用 (重要)
- 新しいデータ取得 (adapter / repository) や schema フィールドを足す前に、同じ情報源が既存層に無いか。`rg` で確認する
- 既存の共有 utility / hooks を無視して再実装していないか
- プロジェクトの既存パターン (Effect-TS, Repository, API envelope 等) から逸脱していないか
- 根拠: `.claude/rules/common/development-workflow.md`「社内コードの既存 capability を先に確認」

## 検証手段

- バグ: 失敗を再現するテストを書いて流す → 失敗確認できれば確定、通ったら誤検知。`bun run test` を使う
- 型: `bunx tsc --noEmit` を該当範囲で実行
- 入力検証漏れ: 異常値 (空文字, 巨大値, 不正型, undefined) を渡して挙動確認
- 性能 (N+1 等): クエリ生成箇所を読んで発行回数を数える / ログで確認。負荷試験は不要
- 保守性・型・再利用の指摘は実行検証不要、規約と diff で判断可

## AUTO_FIX / ESCALATE の寄せ方 (この dimension 固有)

- 明らかなバグ・mechanical 規約違反・dead code・`any`→推論型・mutation→immutable は **AUTO_FIX** 寄り
- 性能改善が DB index / batch サイズ / instance scale に及ぶ、新規依存追加、BC 越境、レイヤ違反は **ESCALATE** (intentional の可能性)
- 「再利用すべき既存資産がある」は、既存実装の意図が読めないことがあるので原則 **ESCALATE** (どちらを正とするか人間判断)。完全な重複コピペが明白なら AUTO_FIX
