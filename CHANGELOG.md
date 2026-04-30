# Changelog

## v9.0.0 - 2026-04-30

### Features

- Added the OpenCode Native Adapter baseline with capability mapping, platform matrix, command map, parity docs, and architecture references.
- Added `core/` deterministic helpers for config/profile/platform/commands/rules and OpenCode artifact generation.
- Added `cli/bin/hypo-workflow` as a setup-only global CLI for setup, doctor, profile, sync, install, and init-project.
- Added OpenCode project scaffold generation for `opencode.json`, `AGENTS.md`, `.opencode/commands/`, `.opencode/agents/`, `.opencode/plugins/hypo-workflow.ts`, and `.opencode/package.json`.
- Added OpenCode agents, Ask/question guidance, todowrite plan discipline, and the `plan-tool-required` built-in rule.
- Added OpenCode plugin event policy scaffold for command context, safe auto-continue, compact context restore, file guard, todo sync, and permission logging.

### Improvements

- Documented full V8.4 parity expectations for OpenCode without making OpenCode runtime a CI dependency.
- Updated command templates so all 30 user commands are traceable from `/hw:*` to OpenCode `/hw-*`.
- Preserved Codex and Claude Code behavior while adding OpenCode-specific generated artifacts.

### Tests

- Added V9 scenarios `s51` through `s59`, covering capability matrix, core helpers, CLI setup, plugin scaffold, command map, agents/Ask/todowrite, events/file guard, V8.4 parity, and V9 regression bundle.
- Regression suite expanded to `59/59`.

## v8.4.0 - 2026-04-30

### Features

- 新增 `/hw:rules`，用于列出规则、调整严格度、创建自定义 Markdown 规则，并导入/导出规则包。
- 新增 `rules/builtin/`，内置 12 条规则，覆盖 guard、style、hook 和 workflow 四类语义标签。
- 新增 `rules/presets/`，提供 `recommended`、`strict`、`minimal` 三套规则集。
- 新增 `.pipeline/rules.yaml` 和 `.pipeline/rules/custom/`，作为项目侧规则配置和自然语言规则入口。
- 新增 `scripts/rules-summary.sh`，供 hook 和测试稳定汇总有效规则、启用数量和 always 规则。

### Improvements

- SessionStart Hook 现在注入 Rules Context，让 active `always` 规则在会话恢复时持续生效。
- `/hw:init` 和 `/hw:setup` 文档加入 Rules 初始化和默认规则集说明。
- `config.schema.yaml` 支持 `rules.extends` 和 `rules.rules`，保持旧项目向后兼容。
- README、命令规范、配置规范和 Showcase 自举物料更新到 V8.4，用户指令数更新为 30。

### Tests

- 新增 `s50-rules-system` 回归场景，覆盖规则资产、命令注册、helper 输出和 SessionStart 注入。
- 回归测试扩展为 `50/50`。
