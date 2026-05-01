# M7 — OpenCode Full Parity：Cycle / Patch / Compact / Showcase / Release

## 需求

- 补齐 V8.4 用户能力在 OpenCode 上的等价入口。
- 覆盖：
  - Cycle：new/list/view/close
  - Patch：create/list/close/fix
  - Compact：生成 compact 视图，配合 OpenCode session compact events
  - Showcase：docs/slides/poster 由 Agent 主导生成
  - Release：validate、dirty check、Ask gate、tag/push 规则
  - Dashboard：OpenCode command 入口映射现有 dashboard 能力
  - Audit/debug/check/reset/log/report/status/guide/rules
- `patch fix` 仍由 Agent 执行六步流程；plugin 只提供上下文、守门和日志/权限桥。

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- parity smoke：
  - OpenCode command map 覆盖 V8.4 全命令面
  - cycle/patch/compact/showcase/release 命令模板存在
  - patch fix 模板保留六步约束
  - release 模板包含 validate、Ask gate、tag/push 约束

## 预期产出

- OpenCode full parity command templates
- parity documentation
- command smoke tests
- 更新 `references/opencode-spec.md`
- 回归场景：`tests/scenarios/v9/s58-opencode-full-v84-parity/`

## 约束

- 用户能力等价，不要求 plugin 自动执行业务逻辑。
- V8.4 Codex/Claude 行为不能退化。
- MCP 可以生成配置入口，但不是本 Milestone 的通过条件。
