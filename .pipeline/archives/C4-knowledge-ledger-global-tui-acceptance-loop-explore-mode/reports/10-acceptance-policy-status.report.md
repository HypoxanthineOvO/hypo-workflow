# M11 / F003 - Acceptance Policy And Status

## 结果

通过。

## 交付内容

- 新增 acceptance policy helper：
  - `resolveAcceptancePolicy`
  - `evaluateAcceptanceStatus`
  - `createRejectionFeedbackTemplate`
- 全局默认配置增加：
  - `acceptance.mode: auto`
  - `acceptance.timeout_hours: 72`
  - `acceptance.reject_escalation_threshold: 3`
- 支持 `manual | auto | timeout` acceptance policy，并保留 `confirm` 兼容。
- timeout acceptance 实现为 deterministic status/check decision，不启动后台 runner，不写 `state.yaml`。
- OpenCode status model 读取 `.pipeline/config.yaml` 并展示 policy/state；timeout 到期时只读显示 `accepted`、`timed_out: true`、`automatic: true`。
- Global TUI config/detail 展示 acceptance policy。
- Cycle/Patch rejection feedback 文件改为结构化模板：
  - `problem`
  - `reproduce_steps`
  - `expected`
  - `actual`
  - `context`
  - `iteration`
  - `created_at`
- Patch/Cycle feedback 文件保留兼容 `feedback` 字段，避免旧 fix context reader 断裂。
- 同步 OpenCode generated artifacts，保持 status runtime standalone importable。
- 更新 config schema、config/state/progress specs、Cycle/Patch skill 文档。

## 验证

- `node --test core/test/acceptance-policy-status.test.js`：4/4
- 定向 acceptance/status/docs 测试：33/33
- `node --test core/test/*.test.js`：145/145
- `python3 tests/run_regression.py`：62/62
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- JSON parse：`.opencode/hypo-workflow.json`、`.opencode/opencode.json`、`opencode.json`、`tui.json`
- `git diff --check`
- 受保护文件 diff check：`.pipeline/state.yaml`、`.pipeline/cycle.yaml`、`.pipeline/rules.yaml` 无改动

## 评估

- `diff_score`: 2
- `code_quality`: 4
- `test_coverage`: 4
- `complexity`: 3
- `architecture_drift`: 1
- `overall`: 1

## 备注

M11 没有把 timeout 设计成后台自动写状态。它只在 status/check surfaces 中做确定性判断，避免 runner 语义和 hidden mutation。Patch lane 仍然不写 `.pipeline/state.yaml`。
