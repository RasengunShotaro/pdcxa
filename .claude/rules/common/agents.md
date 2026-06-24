# Agent Orchestration

## Available Agents

Located in `~/.claude/agents/`:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| planner | Implementation planning | Complex features, refactoring |
| architect | System design | Architectural decisions |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code review | After writing code |
| security-reviewer | Security analysis | Before commits |
| build-error-resolver | Fix build errors | When build fails |
| e2e-runner | E2E testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| doc-updater | Documentation | Updating docs |
| rust-reviewer | Rust code review | Rust projects |

## Immediate Agent Usage

No user prompt needed:
1. Complex feature requests - Use **planner** agent
2. Code just written/modified - Use **code-reviewer** agent
3. Bug fix or new feature - Use **tdd-guide** agent
4. Architectural decision - Use **architect** agent

判断のトリガ:
- **trade-off を伴うアーキ判断**は単発推奨に飛ばない。並列サブエージェントで複数案を議論させ（→ Multi-Perspective Analysis）、結果を**ドメイン語**で trade-off 付きに整理して提示する（理由: 単一推奨は根拠が検証されず、ユーザーが比較レビューできない）
- **AI/LLM 駆動機能が期待通り動かないとき**は、インフラ/コード変更より先に **プロンプトを実データで empirical 検証**する（`empirical-prompt-tuning` skill）。原因切り分けは prompt → model → data → infra の順（理由: 多くは prompt の曖昧さが原因で、コードを触る前にプロンプトを測れば遠回りを避けられる）
- **モダリティやモデルグレードの要否を伴うアーキ判断**（例: 視覚入力は必要か、安いモデルで足りるか）は、推論で決めず**実データの controlled A/B 実測を先に行う**（理由: 会議解析の視覚要否を実測したら「抽出項目は同等・コスト半額」が判明し、推論だけでは逆の結論に向かっていた。実測は数百円・数十分で済み、設計の手戻りより遥かに安い）

## Parallel Task Execution

ALWAYS use parallel Task execution for independent operations:

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. Agent 1: Security analysis of auth module
2. Agent 2: Performance review of cache system
3. Agent 3: Type checking of utilities

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## Multi-Perspective Analysis

For complex problems, use split role sub-agents:
- Factual reviewer
- Senior engineer
- Security expert
- Consistency reviewer
- Redundancy checker
