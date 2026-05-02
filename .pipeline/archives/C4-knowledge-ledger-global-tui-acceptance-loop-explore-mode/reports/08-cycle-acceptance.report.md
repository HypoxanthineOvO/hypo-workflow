# M09 / F003 - Cycle Acceptance

## 结果

通过。

## 交付内容

- 新增 Cycle acceptance runtime helper：
  - `markCyclePendingAcceptance`
  - `acceptCycle`
  - `rejectCycle`
- 新增 `skills/accept/SKILL.md` 和 `skills/reject/SKILL.md`。
- `/hw:accept` 与 `/hw:reject` 已进入 canonical command map、OpenCode command map、generated `.opencode/commands/`。
- `cycle.yaml` 作为 Cycle acceptance 权威状态：
  - `pending_acceptance`
  - `completed`
  - reject 后回到 `active`
- `state.yaml` 仅镜像 compact acceptance 状态；reject full feedback 写入 `.pipeline/acceptance/*.yaml`，state 只保存 `feedback_ref`。
- OpenCode status model 和 footer/sidebar 暴露 acceptance 状态。
- 更新 `skills/cycle/SKILL.md`、`references/state-contract.md`、`references/progress-spec.md`、`references/commands-spec.md`、`references/opencode-spec.md`、`references/opencode-command-map.md`、README 和相关回归场景。
- 按用户要求，将后续 Feature Queue gate 统一为 `auto`。

## 验证

- `node --test core/test/cycle-acceptance.test.js`：3/3
- `node --test core/test/commands-rules-artifacts.test.js core/test/opencode-status.test.js core/test/cycle-acceptance.test.js`：15/15
- `node --test core/test/*.test.js`：138/138
- `python3 tests/run_regression.py`：62/62
- `bash tests/scenarios/v6/s19-help-list/run.sh`
- `bash tests/scenarios/v8.2/s43-v8-2-registration/run.sh`
- `bash tests/scenarios/v9/s51-opencode-capability-matrix/run.sh`
- `bash tests/scenarios/v9/s55-opencode-command-map/run.sh`
- `bash scripts/validate-config.sh`
- `claude plugin validate .`
- `opencode debug config`
- JSON parse：OpenCode JSON 和 CLI package lock
- `git diff --check`

## 评估

- `diff_score`: 3
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

M09 只定义 acceptance helper 与 command semantics，不把 Hypo-Workflow 变成 runner。Cycle archive 仍由 Cycle close/archive flow 管理；manual acceptance gate 本身只更新 Cycle/state/log/PROGRESS 和 feedback 文件。
