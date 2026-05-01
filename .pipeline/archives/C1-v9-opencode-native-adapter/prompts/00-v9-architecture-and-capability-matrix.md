# M0 — V9 架构基线与 OpenCode Capability Matrix

## 需求

- 调研并固化 V9 的 OpenCode 原生适配架构，明确 Hypo-Workflow 哪些能力映射到 OpenCode native，哪些仍由 HW 自己维护。
- 明确 V9 不把 `hypo-workflow` CLI 做成 runner；Agent 仍在 OpenCode / Codex / Claude Code 中执行任务。
- 覆盖 OpenCode plugin、slash commands、agents/subagents、question/Ask、todowrite、permissions、rules/instructions、MCP、events、compaction。
- 建立 Codex / Claude Code / OpenCode 三平台 capability matrix，保证 Codex 平台不退化。

## 预期测试

- `claude plugin validate .`
- `python3 tests/run_regression.py`
- 新增或更新静态测试，验证：
  - 30 个用户命令都有 OpenCode mapping 条目
  - `references/opencode-spec.md` 存在并列出 native/plugin-assisted/agent-prompt/HW-specific 分类
  - `references/platform-capabilities.md` 覆盖 Codex / Claude Code / OpenCode

## 预期产出

- `references/opencode-spec.md`
- `references/platform-capabilities.md`
- `references/v9-architecture.md`
- README 中 V9 架构定位的草稿或链接
- 回归场景：`tests/scenarios/v9/s51-opencode-capability-matrix/`

## 约束

- 不实现 plugin 代码；本 Milestone 只做设计基线和可测试规格。
- 不删除或弱化现有 Codex / Claude Code 指令。
- OpenCode 能力引用优先依据官方文档，不凭记忆假设。
