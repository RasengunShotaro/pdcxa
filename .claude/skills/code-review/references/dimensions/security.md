# Dimension: セキュリティ

担当は **攻撃面と秘密情報**。「悪意ある入力 / 悪意ある利用者 / 漏れてはいけない情報」の観点だけを見る。機能の正しさは correctness reviewer が見る。

## 読む rules

- `.claude/rules/common/security.md`
- `.claude/rules/typescript/security.md`
- `.claude/rules/typescript/coding-style.md` (Input Validation = Zod セクション)

## 検出対象

### 注入系
- XSS (HTML エスケープ漏れ, `dangerouslySetInnerHTML`), SQL/NoSQL injection, command injection, path traversal, prototype pollution, SSRF

### 認証・認可
- 認可境界の弱化, RBAC 漏れ, セッション管理の不備
- **テナント / ユーザー越境**: `tenant_id` / `user_id` スコープの欠落。他テナントのリソースを取得・更新できる経路 (このプロジェクトの最頻出かつ最重大欠陥。`testing.md` §11 と対になる)
- auth cookie / CORS / refresh 戦略の変更 (プロジェクトの認証方針 — cookie 属性・refresh・CORS — から外れていないか)

### 秘密情報・情報漏洩
- ハードコードされた API key / password / token
- エラーメッセージ / API レスポンス / ログへの内部情報・スタックトレース・PII の leak
- ユーザー向けエラー本文が内部実装を晒していないか (実装詳細は出さない)

### 入力検証
- 信頼できない入力 (HTTP body, query, file, 外部 API レスポンス, env) の未検証処理
- システム境界での schema 検証 (Zod) 欠落
- 検証は早期に・明確なエラーで失敗させているか

### 依存・サプライチェーン
- 新規依存パッケージの追加 (既知 CVE / 攻撃面 / メンテ状況)。**追加自体は ESCALATE**
- バージョン pin の有無, lockfile への反映

## 検証手段 (必ず実行で確認)

- SQL injection: payload (`'; DROP TABLE--`) をクエリ生成関数に渡し、生成 SQL を確認
- XSS: payload を入力としてレンダリング結果を確認 (エスケープ漏れ)
- command injection: `; whoami` 系 payload で組まれる実行コマンド文字列を確認
- 越境: 別テナント / 別ユーザーの ID を渡して 404/403 で拒絶されるか、テスト or test client で確認
- 入力検証漏れ: 異常値を境界に渡して挙動確認
- **実 DB / 外部 API / 実 payload の実行はしない**。生成物 (SQL 文字列 / HTML 文字列 / コマンド文字列) の確認に留める。再現に副作用が要るなら Skipped

## AUTO_FIX / ESCALATE の寄せ方 (この dimension 固有)

- セキュリティはほぼ **ESCALATE** 寄り (方針判断・影響範囲が広い)。特に auth 境界 / CORS / rate limit / PII ログ可否 / 新規依存は必ず ESCALATE
- 例外的に AUTO_FIX 可: 明白なエスケープ漏れの 1 箇所修正, 既存 schema を通すだけの validation 追加, ハードコード秘密の env 化 (ただし秘密が露出済みなら rotation は ESCALATE)
- exploit 可能性を確認できたものは深刻度 `[高]` を付ける
