# Commands Spec

Use this reference when the user's message starts with `/hw:` or when exact command parsing matters more than fuzzy natural-language intent matching.

## Namespace

- all explicit Hypo-Workflow commands use the `/hw:` prefix
- V7 canonical namespace contains 22 commands across Setup, Pipeline, Plan, Lifecycle, and Utility groups
- slash commands are exact and namespace-scoped
- slash commands take precedence over fuzzy natural-language matching
- natural-language commands remain valid for backward compatibility

## Parsing Rules

1. treat the first whitespace-delimited token as the command name
2. recognized commands are:
   - `/hw:start`
   - `/hw:resume`
   - `/hw:status`
   - `/hw:skip`
   - `/hw:stop`
   - `/hw:report`
   - `/hw:help`
   - `/hw:reset`
   - `/hw:log`
   - `/hw:setup`
   - `/hw:dashboard`
   - `/hw:check`
   - `/hw:init`
   - `/hw:release`
   - `/hw:audit`
   - `/hw:debug`
   - `/hw:plan`
   - `/hw:plan:discover`
   - `/hw:plan:decompose`
   - `/hw:plan:generate`
   - `/hw:plan:confirm`
   - `/hw:plan:review`
3. parse remaining tokens as command arguments
4. flags are order-independent
5. if a command is unknown, return exactly:
   `Unknown command: /hw:xxx. Available: /hw:start, /hw:resume, /hw:status, /hw:skip, /hw:stop, /hw:report, /hw:plan, /hw:plan:discover, /hw:plan:decompose, /hw:plan:generate, /hw:plan:confirm, /hw:plan:review, /hw:init, /hw:check, /hw:audit, /hw:release, /hw:debug, /hw:help, /hw:reset, /hw:log, /hw:setup, /hw:dashboard`
6. if a known command receives an unsupported flag, stop and report the unsupported flag explicitly instead of guessing
7. if a prompt selector is ambiguous, list the candidates and stop
8. plan and review commands load `plan/PLAN-SKILL.md` before execution
9. if a command starts with `/hw:plan:` and is unknown, return exactly:
   `Unknown command: /hw:plan:xxx. Available: /hw:plan, /hw:plan:discover, /hw:plan:decompose, /hw:plan:generate, /hw:plan:confirm, /hw:plan:review`
10. append-mode conflicts must never silently renumber executed prompts
11. `/hw:review` is a compatibility alias that prints a migration warning instead of running the review directly

## Command Semantics

### `/hw:start`

Supported flags:

- `--from <prompt>`
- `--clean`

Behavior:

- read `.pipeline/config.yaml`
- read `~/.hypo-workflow/config.yaml` if present
- resolve effective config as project > global > defaults before selecting execution mode or subagent provider
- validate config before mutating state
- if `--clean` is present, treat the action as a restart and reinitialize from `assets/state-init.yaml`
- if unfinished state exists and `--clean` is absent, resume that state instead of silently discarding it
- if `--from <prompt>` is present, resolve against prompt filename or prompt stem prefix
- when `--from` is used, initialize `current.prompt_file` directly to the matched prompt
- do not fabricate history entries for prompts that were never executed

### `/hw:resume`

Supported flags:

- `--template <name>`

Preconditions:

- `state.yaml` exists
- state indicates unfinished work, usually `pipeline.status=running|stopped`

Notes:

- user-facing "interrupted" means persisted unfinished state
- V4.5 does not require a literal `pipeline.status=interrupted` enum

Behavior:

- read `state.yaml`
- locate `current.prompt_file` and `current.step`
- continue from the next runnable step

### `/hw:status`

Supported flags:

- none

Behavior:

- prefer `scripts/state-summary.sh`
- if the script is unavailable, fall back to direct config/state inspection
- include the effective execution mode when config files are available
- do not mutate `state.yaml`, `log.md`, `log.yaml`, or reports

### `/hw:skip`

Supported flags:

- `--reason <text>`

Preconditions:

- the pipeline has an active current prompt
- the pipeline is currently resumable, usually `pipeline.status=running|stopped`

Behavior:

- mark the current prompt as skipped
- store the skip reason when provided, otherwise use a concise default such as `user_skipped`
- append a prompt-level skip log event
- write one history entry with `result=skipped`
- do not increment `pipeline.prompts_completed`
- advance directly to the next prompt
- if there is no next prompt, mark the pipeline `completed`

### `/hw:stop`

Supported flags:

- `--no-report`

Preconditions:

- the pipeline has active unfinished work

Behavior:

- persist the current prompt state
- set `pipeline.status=stopped`
- if `--no-report` is absent, write an intermediate report for the current prompt
- append one prompt-level stop event
- do not advance the prompt
- do not mark the prompt aborted

### `/hw:report`

Supported flags:

- none

Behavior:

- locate the most recent report using `history.completed_prompts[-1].report_file` when available
- otherwise fall back to the newest report file in the reports directory
- summarize the latest scores, warnings, and decision

### `/hw:help`

Supported forms:

- `/hw:help`
- `/hw:help --quick`
- `/hw:help <cmd>`

Behavior:

- read `SKILL.md` command tables as the source of truth
- `/hw:help` lists all 22 canonical commands grouped under Setup, Pipeline, Plan, Lifecycle, and Utility
- `/hw:help --quick` returns a compact cheat sheet
- `/hw:help <cmd>` returns detailed usage, flags, and examples for the requested command

### `/hw:reset`

Supported flags:

- none
- `--full`
- `--hard`

Behavior:

- `/hw:reset` resets `state.yaml` to an initial state and preserves config, prompts, architecture, and logs
- `/hw:reset --full` removes state plus generated reports and lifecycle logs while preserving config, prompts, and architecture
- `/hw:reset --hard` removes the entire `.pipeline/` directory after printing the delete list and receiving an explicit `YES`

### `/hw:log`

Supported flags:

- `--all`
- `--type <type>`
- `--since <milestone>`

Behavior:

- read `.pipeline/log.yaml`
- show the newest 10 entries by default
- filter entries by type or milestone when requested
- if `log.yaml` is missing, return `暂无日志，执行 Pipeline 后自动生成`

### `/hw:setup`

Supported flags:

- none

Behavior:

- run the plugin-level setup wizard
- create `~/.hypo-workflow/` if it is missing
- create or update `~/.hypo-workflow/config.yaml`
- detect or confirm `agent.platform` as `claude-code` or `codex`
- configure `execution.default_mode`, `subagent.provider`, provider model settings, `dashboard.enabled`, `dashboard.port`, and `plan.default_mode`
- preserve `created` on existing configs and update `updated`
- write plugin-level configuration outside the project pipeline state

### `/hw:dashboard`

Supported flags:

- none

Behavior:

- ensure dashboard dependencies are installed
- resolve preferred port as project `dashboard.port` > global `dashboard.port` > `7700`
- start or reuse the background dashboard server
- verify `/health`
- open the browser when possible

### `/hw:check`

Supported flags:

- none
- `--config`
- `--notion`
- `--state`

Behavior:

- if `.pipeline/` is missing, return `请先运行 /hw:init`
- otherwise run the six checks defined in `references/check-spec.md`
- return per-check `✅` / `⚠️` / `❌` markers, an overall summary, and a suggested action

### `/hw:init`

Supported flags:

- none
- `--rescan`
- `--folder`
- `--single`

Behavior:

- detect whether the repo is empty, is an existing codebase without `.pipeline/`, or already has a pipeline
- follow the exploration and output rules in `references/init-spec.md`
- on existing pipelines, check completeness first and use `--rescan` to refresh architecture

### `/hw:release`

Supported flags:

- none
- `--dry-run`
- `--skip-tests`
- `--patch`
- `--minor`
- `--major`

Behavior:

- follow the seven-step release flow in `references/release-spec.md`
- require explicit second confirmation for `--skip-tests`
- append a `type: release` entry to `.pipeline/log.yaml`

### `/hw:audit`

Supported flags:

- none
- `--scope <dir>`
- `--focus <dimension>`
- `--since <milestone>`

Behavior:

- follow the four-step audit workflow in `references/audit-spec.md`
- scan all six dimensions by default
- write the detailed report to `.pipeline/audits/` and append an audit log entry

### `/hw:debug`

Supported forms:

- `/hw:debug`
- `/hw:debug "<symptom>"`
- `/hw:debug --trace`
- `/hw:debug --auto-fix`

Behavior:

- follow the five-step reasoning workflow in `references/debug-spec.md`
- distinguish symptom-driven debugging from preventive audit scanning
- write the detailed report to `.pipeline/debug/` and append a debug log entry

### `/hw:plan`

Supported flags:

- none

Behavior:

- load `plan/PLAN-SKILL.md`
- enter Plan Mode using the Discover-first flow
- honor `--template <name>` as an initial template hint when present
- honor `plan.mode=auto|interactive` from project config, falling back to global `plan.default_mode` when available
- default to `/hw:plan:discover` when no explicit sub-phase is given
- do not start normal pipeline execution yet

### `/hw:plan:discover`

Supported flags:

- `--template <name>`

Behavior:

- load `plan/PLAN-SKILL.md`
- inspect the current repository when applicable
- gather goals, constraints, and stack assumptions
- write or update `.pipeline/design-spec.md`
- persist intermediate planning state in `.plan-state/` when available
- in interactive mode, ask targeted follow-up questions in rounds
- in auto mode, continue without pausing unless blocked by missing critical information

### `/hw:plan:decompose`

Supported flags:

- none

Behavior:

- load `plan/PLAN-SKILL.md`
- split the project into milestones
- include test specs and boundary coverage expectations per milestone

### `/hw:plan:generate`

Supported flags:

- `--template <name>`

Behavior:

- load `plan/PLAN-SKILL.md`
- generate `.pipeline/config.yaml`, prompts, and `architecture.md`
- use the requested template when provided
- otherwise choose a template from planning context
- detect append mode when an existing `.pipeline/` workspace is present
- choose `implement-only` for planning-heavy or document-heavy plans unless the project clearly requires executable TDD
- on prompt-number conflicts, preserve executed prompts and append new prompt numbers after the highest existing number unless explicit resequencing is approved

### `/hw:plan:confirm`

Supported flags:

- none

Behavior:

- load `plan/PLAN-SKILL.md`
- summarize generated artifacts
- include project name, stack, preset, milestone count, test point count, and generated files
- in interactive mode, wait for explicit confirmation to continue into `/hw:start`
- in auto mode, treat confirm as a summary checkpoint rather than a hard stop

### `/hw:plan:review`

Supported flags:

- `--full`

Behavior:

- load `plan/PLAN-SKILL.md`
- run Plan Review for the current milestone
- with `--full`, review all completed milestones and architecture deltas
- append or refresh `architecture.md` review notes using the Plan Review format
- emit proposed downstream prompt edits to `.plan-state/prompt-patch-queue.yaml` instead of silently rewriting prompts

### `/hw:review`

Supported flags:

- `--full`

Behavior:

- do not run Plan Review directly
- print `⚠️ \`/hw:review\` 已迁移到 \`/hw:plan:review\`。请使用新命令。此兼容提示将在 V7 中移除。`
- keep `--full` only as part of the compatibility message

## Compatibility Notes

- `开始执行` is the natural-language equivalent of `/hw:start`
- `继续`, `下一步`, `执行下一步` are natural-language equivalents of `/hw:resume`
- `pipeline status`, `状态` are natural-language equivalents of `/hw:status`
- `跳过当前步骤` remains a step-level skip and is not the same as `/hw:skip`
- `中止`, `abort` remain hard-abort operations and are not the same as `/hw:stop`
- `/hw:plan` enters planning mode and is not the same as `/hw:start`
- `/hw:plan:review` is a planning review surface and not the same as `review_code`
- `/hw:review --full` remains a compatibility reminder during V6 only
- slash commands are entry shortcuts only; they do not change TDD, evaluation, or delegation semantics
