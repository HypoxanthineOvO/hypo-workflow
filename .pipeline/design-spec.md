# V9 Design Spec — OpenCode Native Adapter

## Goal

Bring Hypo-Workflow to OpenCode as a native plugin-backed experience while keeping Codex and Claude Code behavior intact.

V9 is not a rewrite into a standalone runner. Agents still execute workflow tasks. Hypo-Workflow provides setup, platform configuration, command prompts, state conventions, rules, context injection, event handling, and guardrails.

## Confirmed Decisions

- OpenCode support is delivered primarily as a plugin.
- OpenCode commands use platform-native mapped names such as `/hw-plan`, `/hw-start`, and `/hw-rules`; Codex/Claude keep `/hw:*`.
- `core/` is a shared deterministic configuration and artifact generation kernel, not a pipeline execution engine.
- Global `hypo-workflow` CLI/TUI handles setup, doctor, sync, profile, install, and project adapter initialization only.
- OpenCode first version targets full V8.4 user capability parity.
- OpenCode auto continue defaults to enabled with `safe` mode.
- Interactive checkpoints use OpenCode Ask/question unless automation is explicitly enabled.
- `todowrite` is enabled by default and synced to `.plan-state/todo.yaml`.
- OpenCode file guard uses standard mode:
  - critical `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, `.pipeline/rules.yaml` writes are error-gated outside valid command context
  - ordinary `.pipeline/` writes warn
- MCP is supported by config generation when available, but it is not the first critical path.
- Codex/Claude Plan discipline is improved with a `plan-tool-required` rule and stronger planning instructions.

## OpenCode Native Mapping

| HW Surface | OpenCode Native Capability | V9 Handling |
|---|---|---|
| Slash commands | `.opencode/commands/*.md` | Generate mapped `/hw-*` commands for all 30 user commands |
| Plan interaction | Plan primary agent, question tool, permissions | `/hw-plan*` binds `hw-plan`, Ask gates interactive checkpoints |
| Todo tracking | `todowrite`, `todo.updated` | Sync to `.plan-state/todo.yaml` |
| Context restore | plugin events, session compacted | Inject state/progress/cycle/rules/patch compact context |
| Auto continue | session/tool events | `tool.execute.after` updates facts, `session.idle` decides continue |
| Rules | AGENTS.md / instructions + plugin guard | Map always rules to OpenCode rules, keep HW severity model |
| Subagents | OpenCode agents/subagents | Generate `hw-plan`, `hw-build`, `hw-explore`, `hw-review`, `hw-debug`, `hw-docs` |
| Permissions | allow/ask/deny | Standard file guard and hard-gate Ask behavior |
| MCP | OpenCode MCP config | Generate config when requested; not required for first critical path |

## Non-Goals

- Do not make `hypo-workflow` CLI run the pipeline.
- Do not make OpenCode plugin write business code or reports automatically.
- Do not remove Codex or Claude Code compatibility paths.
- Do not force a unified model router on platforms that do not support it.

## Milestones

1. V9 architecture and OpenCode capability matrix
2. `core/` shared config and artifact kernel
3. Global CLI/TUI setup
4. OpenCode plugin scaffold and project adapter
5. OpenCode slash command mapping
6. OpenCode agents, Ask, todowrite, and Plan discipline
7. OpenCode events: auto continue, context restore, file guard
8. OpenCode full V8.4 parity
9. V9 regression and smoke tests
10. V9 docs, bootstrap, and release
