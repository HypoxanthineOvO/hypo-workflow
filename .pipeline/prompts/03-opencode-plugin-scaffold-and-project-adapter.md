# M3 — OpenCode Plugin 骨架与项目级适配产物

## 需求

- 新增 `plugins/opencode/` 作为 OpenCode 一等适配层。
- `hypo-workflow init-project` 能生成项目级 OpenCode 文件：
  - `opencode.json`
  - `AGENTS.md`
  - `.opencode/commands/`
  - `.opencode/plugins/hypo-workflow.ts`
  - `.opencode/package.json`
- OpenCode plugin 定位为：
  - 原生能力适配层
  - 文件系统守门员
  - 上下文注入器
  - Ask/permissions/events 桥接器
- Plugin 不自动完成业务任务，不替 Agent 写代码、修 bug 或生成报告内容。

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- 静态测试：
  - `plugins/opencode/` 结构存在
  - init-project 生成所有必要文件
  - plugin scaffold 导出 OpenCode 可加载形态
  - 生成文件包含 HW 版本和 command map metadata

## 预期产出

- `plugins/opencode/`
- OpenCode plugin template
- OpenCode project scaffold generator
- `opencode.json` template
- `AGENTS.md` template
- 回归场景：`tests/scenarios/v9/s54-opencode-plugin-scaffold/`

## 约束

- 不要求真实 OpenCode runtime 在 CI 中运行；先做静态与模板 smoke。
- 生成物必须清楚标注由 Hypo-Workflow 管理，避免用户误删。
- Codex/Claude 路径不得因 OpenCode scaffolding 改名或移动。
