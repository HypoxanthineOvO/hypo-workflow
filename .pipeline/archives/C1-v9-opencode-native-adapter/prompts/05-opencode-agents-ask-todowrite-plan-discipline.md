# M5 — OpenCode Agents / Ask / TodoWrite / Plan Discipline

## 需求

- 生成 OpenCode agents：
  - `hw-plan`
  - `hw-build`
  - `hw-explore`
  - `hw-review`
  - `hw-debug`
  - `hw-docs`
- `/hw-plan*` 自动使用 `hw-plan`，用户不需要手动切 agent。
- 所有 interactive hard gate 默认使用 OpenCode question/Ask，除非用户启用自动化。
- Plan 阶段默认启用 `todowrite`。
- `todo.updated` 同步到 `.plan-state/todo.yaml`，使 Plan 可恢复。
- 顺手修 Codex/Claude Plan discipline：
  - 新增 `plan-tool-required` built-in rule
  - 更新 root/plan skill 指令
  - 复杂任务必须维护 plan
  - P1/P2/P3/P4 checkpoint 必须同步计划状态

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- OpenCode agent config 静态测试：
  - agents 6/6 生成
  - `/hw-plan*` command 指向 `hw-plan`
  - hard gate 模板引用 question/Ask
  - todowrite sync 配置存在
- Codex/Claude 规则测试：
  - `rules/builtin/plan-tool-required.yaml` 存在
  - Plan skill 文档包含 plan 工具纪律

## 预期产出

- OpenCode agents templates
- Ask/hard gate policy
- todowrite sync adapter
- `rules/builtin/plan-tool-required.yaml`
- Plan discipline docs
- 回归场景：`tests/scenarios/v9/s56-agents-ask-todo-plan-discipline/`

## 约束

- Codex 侧不能真正强制 `update_plan`，只能通过规则和 Skill discipline 改善。
- OpenCode 侧优先使用 native question/todowrite，而不是自造问答文件。
- 自动化模式必须明确配置，不能误跳 interactive gate。
