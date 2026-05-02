# OpenCode Command Map

OpenCode uses dash-style native slash commands. Each command remains traceable to a canonical Hypo-Workflow command.

| HW command | OpenCode command | Agent | Skill |
|---|---|---|---|
| `/hw:start` | `/hw-start` | `hw-build` | `skills/start/SKILL.md` |
| `/hw:resume` | `/hw-resume` | `hw-build` | `skills/resume/SKILL.md` |
| `/hw:status` | `/hw-status` | `hw-status` | `skills/status/SKILL.md` |
| `/hw:skip` | `/hw-skip` | `hw-build` | `skills/skip/SKILL.md` |
| `/hw:stop` | `/hw-stop` | `hw-status` | `skills/stop/SKILL.md` |
| `/hw:report` | `/hw-report` | `hw-report` | `skills/report/SKILL.md` |
| `/hw:chat` | `/hw-chat` | `hw-build` | `skills/chat/SKILL.md` |
| `/hw:plan` | `/hw-plan` | `hw-plan` | `skills/plan/SKILL.md` |
| `/hw:plan:discover` | `/hw-plan-discover` | `hw-plan` | `skills/plan-discover/SKILL.md` |
| `/hw:plan:decompose` | `/hw-plan-decompose` | `hw-plan` | `skills/plan-decompose/SKILL.md` |
| `/hw:plan:generate` | `/hw-plan-generate` | `hw-plan` | `skills/plan-generate/SKILL.md` |
| `/hw:plan:confirm` | `/hw-plan-confirm` | `hw-plan` | `skills/plan-confirm/SKILL.md` |
| `/hw:plan:extend` | `/hw-plan-extend` | `hw-plan` | `skills/plan-extend/SKILL.md` |
| `/hw:plan:review` | `/hw-plan-review` | `hw-review` | `skills/plan-review/SKILL.md` |
| `/hw:cycle` | `/hw-cycle` | `hw-status` | `skills/cycle/SKILL.md` |
| `/hw:patch` | `/hw-patch` | `hw-build` | `skills/patch/SKILL.md` |
| `/hw:patch fix` | `/hw-patch-fix` | `hw-build` | `skills/patch/SKILL.md` |
| `/hw:compact` | `/hw-compact` | `hw-compact` | `skills/compact/SKILL.md` |
| `/hw:guide` | `/hw-guide` | `hw-plan` | `skills/guide/SKILL.md` |
| `/hw:showcase` | `/hw-showcase` | `hw-build` | `skills/showcase/SKILL.md` |
| `/hw:rules` | `/hw-rules` | `hw-status` | `skills/rules/SKILL.md` |
| `/hw:init` | `/hw-init` | `hw-plan` | `skills/init/SKILL.md` |
| `/hw:check` | `/hw-check` | `hw-status` | `skills/check/SKILL.md` |
| `/hw:audit` | `/hw-audit` | `hw-review` | `skills/audit/SKILL.md` |
| `/hw:release` | `/hw-release` | `hw-build` | `skills/release/SKILL.md` |
| `/hw:debug` | `/hw-debug` | `hw-debug` | `skills/debug/SKILL.md` |
| `/hw:help` | `/hw-help` | `hw-status` | `skills/help/SKILL.md` |
| `/hw:reset` | `/hw-reset` | `hw-status` | `skills/reset/SKILL.md` |
| `/hw:log` | `/hw-log` | `hw-status` | `skills/log/SKILL.md` |
| `/hw:setup` | `/hw-setup` | `hw-status` | `skills/setup/SKILL.md` |
| `/hw:dashboard` | `/hw-dashboard` | `hw-status` | `skills/dashboard/SKILL.md` |

Agent policy:

- `/hw-plan*`, `/hw:init`, and `/hw:guide` use `hw-plan` to maximize Ask/question and todowrite discipline.
- Execution and mutation-heavy commands use `hw-build`.
- Compact, debug, and report commands use `hw-compact`, `hw-debug`, and `hw-report` so the OpenCode model matrix can tune those roles independently.
- Audit/review commands use `hw-review`.
- Status/help/log/rules/check commands use `hw-status`.
