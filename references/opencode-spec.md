# V9 OpenCode Native Adapter Spec

This document freezes the V9 mapping target before plugin code starts. The goal is to reuse OpenCode native features wherever they already exist, while keeping Hypo-Workflow's workflow semantics portable across OpenCode, Codex, and Claude Code.

V8.4 parity is tracked in [`opencode-parity.md`](./opencode-parity.md).

## Official Source Baseline

| Area | Official docs | V9 interpretation |
|---|---|---|
| Plugins and events | https://opencode.ai/docs/plugins/ | Native extension point for file guards, event listeners, context injection, auto-continue, and custom tools. |
| Slash commands | https://opencode.ai/docs/commands/ | Native command surface for `/hw-*` files. |
| Agents and subagents | https://opencode.ai/docs/agents/ | Native primary agents and subagents replace HW-owned delegation prompts on OpenCode. |
| Tools | https://opencode.ai/docs/tools/ | Native `question` and `todowrite` tools are required for Plan and execution discipline. |
| Permissions | https://opencode.ai/docs/permissions | Native allow/ask/deny permission model backs file guard and setup defaults. |
| Rules/instructions | https://opencode.ai/docs/rules | Native `AGENTS.md` and instruction loading carry persistent agent guidance. |
| MCP | https://opencode.ai/docs/mcp-servers/ | Optional external-tool channel, not required for V9 parity. |
| Models | https://opencode.ai/docs/models/ | Native model/provider/variant config is used before HW implements any router. |

## Capability Classification

| Capability | Classification | OpenCode mapping | HW responsibility |
|---|---|---|---|
| Slash command invocation | native | `.opencode/commands/*.md` | Generate command files and stable templates. |
| Plan-phase user questions | native | `question` tool / Ask flow | Decide when to ask and enforce gates. |
| Todo and plan tracking | native | `todowrite` tool | Translate milestones and steps into useful todo groups. |
| Primary agents | native | `agent: plan`, `agent: build`, custom `hw-*` agents | Generate agent definitions from HW profiles. |
| Subagents | native | markdown agents with `mode: subagent` | Map HW explorer/worker/reviewer roles. |
| Permissions | native | `permission` allow/ask/deny config | Provide safe presets and file-guard policy. |
| Rules and instructions | native | `AGENTS.md`, `opencode.json.instructions` | Export HW rules into native instruction sources. |
| Model selection | native | provider/model/variant config | Prefer OpenCode config; HW only supplies profile defaults. |
| MCP servers | native | `mcp` config | Optional setup integration, not required for command parity. |
| Plugin lifecycle | plugin-assisted | `.opencode/plugins/hypo-workflow.ts` | Listen to events and coordinate HW artifacts. |
| Command context capture | plugin-assisted | `command.executed`, `tui.command.execute` | Record invoked command, args, and current project state. |
| Auto continue | plugin-assisted | `tool.execute.after`, `session.idle`, `session.status` | Apply HW evaluation rules and continue only under safe policy. |
| File guard | plugin-assisted | `tool.execute.before`, permission config | Protect state/cycle/rules as errors; warn on ordinary `.pipeline` writes. |
| Context compaction | plugin-assisted | `experimental.session.compacting`, `session.compacted` | Inject compact HW state into compaction summaries. |
| Context loading | plugin-assisted | session events plus generated instructions | Load current prompt/state/report without flooding context. |
| Interactive guide | agent-prompt | `/hw-guide` command template + `question` | Keep intent matching in prompt policy. |
| Plan interview flow | agent-prompt | `/hw-plan*` commands on plan agent | Enforce explicit confirmation and targeted follow-up. |
| Report prose | agent-prompt | generated command prompt and templates | Preserve HW report structure and language policy. |
| Cycle model | HW-specific | files under `.pipeline/` | Own `cycle.yaml`, archives, deferred items, summaries. |
| Patch track | HW-specific | files under `.pipeline/patches/` | Own patch numbering, lifecycle, and fix lane. |
| Pipeline state machine | HW-specific | `.pipeline/state.yaml` | Own milestones, step order, progress, and recovery. |
| PROGRESS/log/report contracts | HW-specific | `.pipeline/PROGRESS.md`, `log.yaml`, reports | Own file formats and compatibility. |
| HW rules severity model | HW-specific | `.pipeline/rules.yaml`, `rules/` | Own off/warn/error semantics; export compatible parts to OpenCode. |

## Canonical Command Mapping

| HW command | OpenCode command | Agent | Route |
|---|---|---|---|
| `/hw:start` | `/hw-start` | `hw-build` | Native slash command, plugin-assisted state/context. |
| `/hw:resume` | `/hw-resume` | `hw-build` | Native slash command, plugin-assisted recovery. |
| `/hw:status` | `/hw-status` | `hw-status` | Native slash command, reads compact state. |
| `/hw:skip` | `/hw-skip` | `hw-build` | Native slash command, HW-specific state mutation. |
| `/hw:stop` | `/hw-stop` | `hw-status` | Native slash command, HW-specific state mutation. |
| `/hw:report` | `/hw-report` | `hw-status` | Native slash command, HW-specific report contract. |
| `/hw:plan` | `/hw-plan` | `hw-plan` | Native slash command, OpenCode question/todowrite required. |
| `/hw:plan:discover` | `/hw-plan-discover` | `hw-plan` | Native slash command, Ask-gated discovery. |
| `/hw:plan:decompose` | `/hw-plan-decompose` | `hw-plan` | Native slash command, todowrite mirrors milestone draft. |
| `/hw:plan:generate` | `/hw-plan-generate` | `hw-plan` | Native slash command, core artifact generation. |
| `/hw:plan:confirm` | `/hw-plan-confirm` | `hw-plan` | Native slash command, explicit confirmation gate. |
| `/hw:plan:extend` | `/hw-plan-extend` | `hw-plan` | Native slash command, active Cycle extension. |
| `/hw:plan:review` | `/hw-plan-review` | `hw-review` | Native slash command, architecture drift review. |
| `/hw:cycle` | `/hw-cycle` | `hw-status` | Native slash command group; subcommands remain prompt arguments. |
| `/hw:patch` | `/hw-patch` | `hw-build` | Native slash command group; file lifecycle stays HW-specific. |
| `/hw:patch fix` | `/hw-patch-fix` | `hw-build` | Native slash command, six-step patch repair lane. |
| `/hw:compact` | `/hw-compact` | `hw-status` | Native slash command, compact generator. |
| `/hw:guide` | `/hw-guide` | `hw-plan` | Native slash command, question-driven onboarding. |
| `/hw:showcase` | `/hw-showcase` | `hw-build` | Native slash command, showcase preset. |
| `/hw:rules` | `/hw-rules` | `hw-status` | Native slash command, rules file management. |
| `/hw:init` | `/hw-init` | `hw-plan` | Native slash command, project bootstrap/history import. |
| `/hw:check` | `/hw-check` | `hw-status` | Native slash command, health checks. |
| `/hw:audit` | `/hw-audit` | `hw-review` | Native slash command, preventive audit. |
| `/hw:release` | `/hw-release` | `hw-build` | Native slash command, release automation. |
| `/hw:debug` | `/hw-debug` | `hw-build` | Native slash command, symptom-driven debug. |
| `/hw:help` | `/hw-help` | `hw-status` | Native slash command, generated help. |
| `/hw:reset` | `/hw-reset` | `hw-status` | Native slash command, guarded reset. |
| `/hw:log` | `/hw-log` | `hw-status` | Native slash command, lifecycle log view. |
| `/hw:setup` | `/hw-setup` | `hw-status` | Native slash command, delegates to global setup profile guidance. |
| `/hw:dashboard` | `/hw-dashboard` | `hw-status` | Native slash command, dashboard launcher. |

## OpenCode Agent Plan

| Agent | Mode | Default permissions | Purpose |
|---|---|---|---|
| `hw-plan` | primary | read/question/todowrite allowed, edit ask | Plan, history import review, guide, and plan review. |
| `hw-build` | primary | read/edit/bash ask according to profile | Start/resume/release/debug/showcase implementation work. |
| `hw-status` | primary | read allowed, edit deny by default | Status, help, log, check, rules list, compact summaries. |
| `hw-review` | subagent | read allowed, edit deny | Audit and architecture/code review. |
| `hw-explorer` | subagent | read/search allowed, edit deny | Bounded codebase exploration. |
| `hw-worker` | subagent | edit ask, scoped by task | Optional parallel implementation where OpenCode supports subtasks. |

Plan commands must bind to `hw-plan` by default. If OpenCode exposes nested planning through `todowrite` only, HW treats nested plans as hierarchical todos instead of inventing a second state machine.

## Event and Guard Strategy

| Event/hook | Usage |
|---|---|
| `command.executed` and `tui.command.execute` | Capture current HW command and arguments for log/context continuity. |
| `tool.execute.before` | Enforce file guard before edits or shell actions. |
| `tool.execute.after` | Update heartbeat and inspect tests/evaluation signals. |
| `session.idle` and `session.status` | Trigger safe auto-continue when enabled. |
| `session.compacted` and `experimental.session.compacting` | Preserve current Cycle, milestone, prompt, and compact files across compaction. |
| `permission.asked` and `permission.replied` | Record user approvals when they affect HW state. |
| `todo.updated` | Mirror OpenCode todos into PROGRESS summaries where useful. |

Default auto-continue is on for OpenCode with `safe` policy: continue after green tests, explicit low-risk report/evaluation, no open error-severity rules, no dirty protected HW files, and no pending Ask/question gate.

## Non-Goals for M0

- No plugin code is implemented here.
- No Codex or Claude Code command is removed or renamed.
- MCP is documented as a native optional channel, not a required dependency.
