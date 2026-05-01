# M6 — OpenCode Event Hooks：Auto Continue、Context Restore、File Guard

## 需求

- 用 OpenCode plugin events 实现自动继续、上下文恢复和文件守门。
- OpenCode profile 默认：
  ```yaml
  auto_continue:
    enabled: true
    mode: safe
  ```
- 支持模式：
  - `ask`
  - `safe`
  - `aggressive`
- 事件组合：
  - `command.executed`：记录 HW command context
  - `tool.execute.before`：规则 gate / 文件守门
  - `tool.execute.after`：更新事实、heartbeat、log
  - `session.idle`：判断是否自动继续
  - `session.compacted`：注入 state/progress/cycle/rules/patch context
  - `permission.asked/replied`：记录 Ask 与用户决策
- 文件守门标准模式：
  - 关键文件 `.pipeline/state.yaml`、`.pipeline/cycle.yaml`、`.pipeline/rules.yaml` error gate
  - 普通 `.pipeline` 写入 warn
  - 命令上下文合法时放行

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- event handler smoke：
  - command context 自动记录
  - safe auto continue 策略生成
  - compact context 注入包含 state/progress/cycle/rules/patch
  - 非法关键文件写入被 error gate
  - 普通 `.pipeline` 写入 warn

## 预期产出

- OpenCode plugin event handlers
- auto-continue policy
- context restore adapter
- file guard policy
- permission event logging
- 回归场景：`tests/scenarios/v9/s57-opencode-events-auto-continue-file-guard/`

## 约束

- Plugin 不替 Agent 执行任务，只判断是否该继续、该问、该拦、该注入。
- Auto continue 必须尊重 Rules `error`、evaluation 阈值和 interactive gates。
- Codex/Claude 现有 watchdog/compact 机制不得退化。
