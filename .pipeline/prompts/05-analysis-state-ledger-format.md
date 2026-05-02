# M06 / F003 — Analysis State Summary and Ledger Format

## 实施计划

1. 阅读 `references/state-contract.md`、`references/log-spec.md`、`references/feature-queue-spec.md`、`references/metrics-spec.md`、`skills/start/SKILL.md`、`skills/resume/SKILL.md`。
2. 设计 analysis state summary，保持 `.pipeline/state.yaml` 仍是线性执行指针。
3. 设计独立 evidence ledger 路径和格式，例如 `.pipeline/analysis/<milestone-id>-analysis-ledger.yaml`。
4. Ledger 第一版字段必须支持研究/博士式可复查：
   - `question`
   - `environment_snapshot`
   - `hypotheses[]`
   - `experiments[]`
   - `observations[]`
   - `metrics`
   - `interpretation`
   - `conclusion`
   - `confidence`
   - `next_actions`
   - `code_change_refs`
   - `threats_to_validity`
   - `ruled_out_alternatives`
5. 强制 `environment_snapshot` 至少记录 branch/commit、有效配置摘要、关键命令参数、数据/日志来源、时间窗、模型/provider 参数（适用时）。
6. 增加 ledger fixture tests 和 state contract docs。

## 依赖

- M04
- M05
- `references/state-contract.md`
- `references/log-spec.md`
- `skills/start/SKILL.md`
- `skills/resume/SKILL.md`

## 验证点

- hypothesis backtracking 不要求回滚 `current.step`。
- ledger 可以表达多个 hypotheses 和多个 experiments。
- state summary 足够 status/watchdog/resume 使用，但不膨胀成完整证据库。
- ledger fixture 可解析、字段完整。

## 约束

- 不把完整证据链塞进 `.pipeline/state.yaml`。
- 不破坏现有 state contract 的线性 step pointer。

## 需求

- 扩展 state contract。
- 新增 analysis ledger spec。
- 新增 ledger example/fixtures。

## 预期测试

- `node --test core/test/*.test.js`
- YAML fixture parse tests。
- state/ledger contract tests。
- `git diff --check`

## 预期产出

- `references/analysis-spec.md` ledger section 或独立 `references/analysis-ledger-spec.md`
- state contract 更新
- ledger fixtures/tests
