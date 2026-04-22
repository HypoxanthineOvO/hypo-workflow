# Commands Spec

Use this reference when the user's message starts with `/hw:` or when exact command parsing matters more than fuzzy natural-language intent matching.

## Namespace

- all explicit Hypo-Workflow commands use the `/hw:` prefix
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
   - `/hw:plan`
   - `/hw:plan:discover`
   - `/hw:plan:decompose`
   - `/hw:plan:generate`
   - `/hw:plan:confirm`
   - `/hw:review`
3. parse remaining tokens as command arguments
4. flags are order-independent
5. if a command is unknown, return exactly:
   `Unknown command: /hw:xxx. Available: /hw:start, /hw:resume, /hw:status, /hw:skip, /hw:stop, /hw:report`
6. if a known command receives an unsupported flag, stop and report the unsupported flag explicitly instead of guessing
7. if a prompt selector is ambiguous, list the candidates and stop
8. plan and review commands load `plan/PLAN-SKILL.md` before execution
9. if a command starts with `/hw:plan:` and is unknown, return exactly:
   `Unknown command: /hw:plan:xxx. Available: /hw:plan, /hw:plan:discover, /hw:plan:decompose, /hw:plan:generate, /hw:plan:confirm, /hw:review`

## Command Semantics

### `/hw:start`

Supported flags:

- `--from <prompt>`
- `--clean`

Behavior:

- read `.pipeline/config.yaml`
- validate config before mutating state
- if `--clean` is present, treat the action as a restart and reinitialize from `assets/state-init.yaml`
- if unfinished state exists and `--clean` is absent, resume that state instead of silently discarding it
- if `--from <prompt>` is present, resolve against prompt filename or prompt stem prefix
- when `--from` is used, initialize `current.prompt_file` directly to the matched prompt
- do not fabricate history entries for prompts that were never executed

### `/hw:resume`

Supported flags:

- none

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
- do not mutate `state.yaml`, `log.md`, or reports

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

### `/hw:plan`

Supported flags:

- none

Behavior:

- load `plan/PLAN-SKILL.md`
- enter Plan Mode using the Discover-first flow
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

### `/hw:plan:confirm`

Supported flags:

- none

Behavior:

- load `plan/PLAN-SKILL.md`
- summarize generated artifacts
- wait for explicit confirmation to continue into `/hw:start`

### `/hw:review`

Supported flags:

- `--full`

Behavior:

- load `plan/PLAN-SKILL.md`
- run Plan Review for the current milestone
- with `--full`, review all completed milestones and architecture deltas

## Compatibility Notes

- `开始执行` is the natural-language equivalent of `/hw:start`
- `继续`, `下一步`, `执行下一步` are natural-language equivalents of `/hw:resume`
- `pipeline status`, `状态` are natural-language equivalents of `/hw:status`
- `跳过当前步骤` remains a step-level skip and is not the same as `/hw:skip`
- `中止`, `abort` remain hard-abort operations and are not the same as `/hw:stop`
- `/hw:plan` enters planning mode and is not the same as `/hw:start`
- `/hw:review` is a planning review surface and not the same as `review_code`
- slash commands are entry shortcuts only; they do not change TDD, evaluation, or delegation semantics
