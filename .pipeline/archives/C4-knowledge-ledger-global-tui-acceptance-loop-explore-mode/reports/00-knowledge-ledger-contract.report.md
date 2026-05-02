# M01 / F001 — Knowledge Ledger Contract Report

## 结论

M01 通过。已定义 Knowledge Ledger 合同，并落地最小确定性 helper、默认配置、Skill、`/hw:knowledge` 命令映射和 OpenCode 映射表面。完整 hook 采集、自动索引和 SessionStart 注入留给后续 Milestone。

## 主要变更

- 新增 `references/knowledge-spec.md` 和 `skills/knowledge/SKILL.md`。
- 新增 `core/src/knowledge/index.js`，提供记录校验、递归脱敏和 SessionStart 加载计划。
- 更新 `DEFAULT_GLOBAL_CONFIG.knowledge`、`references/config-spec.md`、`references/commands-spec.md`、根 `SKILL.md`、README、Skill inventory 和 OpenCode command map。
- 新增 `/hw:knowledge` / `/hw-knowledge` 映射，并同步当前 `.opencode` 命令文件、metadata 和 plugin commandMap。
- 新增 `core/test/knowledge-ledger.test.js` 与 `core/test/fixtures/knowledge/M01-milestone-record.yaml`。
- 更新回归场景中 31 -> 32 command 的断言。

## 验证

- `node --test core/test/knowledge-ledger.test.js`：5/5 通过
- `node --test core/test/*.test.js`：110/110 通过
- `bash scripts/validate-config.sh .pipeline/config.yaml`：通过
- `.opencode/hypo-workflow.json` JSON parse：通过
- `git diff --check`：通过
- `python3 tests/run_regression.py`：62/62 通过
- `claude plugin validate .`：通过
- `node core/bin/hw-core commands`：可输出包含 `/hw:knowledge` 的命令表

## 评估

| 维度 | 分数 |
|---|---:|
| diff_score | 2 |
| code_quality | 4 |
| test_coverage | 4 |
| complexity | 2 |
| architecture_drift | 1 |
| overall | 1 |

## 后续

M02 从 Knowledge helpers and compact index 开始，继续实现 append、index rebuild 和 compact rendering 的完整 deterministic helper。
