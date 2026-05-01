# M4 — OpenCode Slash Commands 全量映射

## 需求

- 为 V8.4 的 30 个用户命令生成 OpenCode slash command 映射。
- OpenCode 命名使用短横线，不污染 Codex/Claude `/hw:*`：
  - `/hw-plan`
  - `/hw-plan-discover`
  - `/hw-start`
  - `/hw-cycle-new`
  - `/hw-patch-fix`
  - `/hw-rules`
- 命令模板需要加载对应 HW 指令、规则、当前 `.pipeline` 上下文和 OpenCode agent 配置。
- `/hw-plan*` 命令自动绑定 `hw-plan` agent。
- 执行类命令绑定 `hw-build` agent。
- 审查/调试/文档类命令绑定对应 agent。

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- command mapping 测试：
  - 30/30 用户命令都有 OpenCode 映射
  - 每个 command 文件包含 canonical HW command 引用
  - plan 命令绑定 `hw-plan`
  - start/resume/patch-fix/release 等绑定正确 agent

## 预期产出

- OpenCode command generator
- `.opencode/commands/*.md` templates
- `references/opencode-command-map.md`
- 回归场景：`tests/scenarios/v9/s55-opencode-command-map/`

## 约束

- 不强制 OpenCode 使用 `/hw:*` 冒号命名。
- 所有 mapping 必须可追溯到 canonical HW command。
- 不删除根 `SKILL.md` 中现有命令表。
