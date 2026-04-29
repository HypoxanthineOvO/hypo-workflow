---
name: start
description: Start Hypo-Workflow execution when the user wants to begin running milestones, continue automatically through the pipeline, or execute the first prompt.
---

# /hypo-workflow:start

Use this skill to start execution from a local `.pipeline/` workspace. This is the Claude Code native entrypoint for the same behavior described by the root `SKILL.md` `/hw:start` command.

## Preconditions

- `.pipeline/config.yaml` exists and should be validated before mutating state
- prompt files exist under the configured prompts directory
- if `.pipeline/state.yaml` already contains unfinished work, resume it unless the user explicitly asks for a clean restart

## Execution Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Read `.pipeline/config.yaml`, normalize defaults, and validate it against `config.schema.yaml`.
3. Resolve effective config as project > global > defaults:
   - `execution.mode` falls back to global `execution.default_mode`, then `self`
   - `execution.subagent_tool` falls back to global `subagent.provider`, then `auto`
   - `dashboard.*` and `plan.*` use the same priority when relevant
4. Read `.pipeline/state.yaml` if present; otherwise initialize state from `assets/state-init.yaml`.
5. If `watchdog.enabled=true`, register the project watchdog cron entry before long-running execution begins.
6. Create `.pipeline/.lock` before entering active execution.
7. Set `current.phase=executing` and update top-level `last_heartbeat` with an ISO-8601 timestamp before running milestones.
8. Treat Claude as the orchestrator:
   - Claude plans the current step
   - Claude delegates concrete sub-work to serial subagent tasks when appropriate
   - Claude verifies results, updates state, logging, and progress artifacts
9. Execute the active milestone serially:
   - `write_tests`
   - `review_tests`
   - `run_tests_red`
   - `implement`
   - `run_tests_green`
   - `review_code`
   - report and commit work if the prompt requires it
10. After every meaningful step, update:
   - `.pipeline/state.yaml`
   - `.pipeline/log.yaml`
   - `.pipeline/PROGRESS.md`
   - top-level `last_heartbeat`
11. After a Milestone report is generated and the Milestone reaches a final state, resolve `compact.auto` from project > global > defaults. If `compact.auto=true`, run the `/hw:compact` generation rules before advancing to the next Milestone.
12. On failure, Claude must choose one of:
   - `retry`: revise instructions and rerun the failed step
   - `deferred`: mark the milestone deferred if downstream work can continue safely
   - `stop`: stop and surface the blocking reason to the user
13. Keep moving automatically between milestones while unfinished work remains.
14. Remove `.pipeline/.lock` when the execution turn completes, stops, blocks, aborts, or finishes.
15. If the pipeline completes or stops intentionally, unregister the watchdog cron entry.
16. Only allow the turn to end naturally when all milestones are complete or Claude has explicitly chosen the `stop` outcome.

## Watchdog Integration

- resolve `watchdog.*` from project > global > defaults
- when `watchdog.enabled=false`, do not register cron
- when enabled, register `scripts/watchdog.sh <project-root>` with marker `# hypo-workflow-watchdog:<project-root>`
- write `last_heartbeat` every time state is persisted during execution
- create `.pipeline/.lock` before executing steps so watchdog cannot reenter the same run
- remove `.pipeline/.lock` on all clean exits and blocking exits

## Failure Handling

- `retry` is allowed without a fixed numeric cap when Claude believes another strategy can work
- `deferred` requires writing `milestones[].status=deferred` and `deferred_reason`
- `stop` should leave a clear reason in state, log, and progress summary

## Progress Tracking

- create `.pipeline/PROGRESS.md` if it does not exist
- update current milestone status after every step
- summarize recent activity and deferred items for human readers

## Reference Files

- `references/tdd-spec.md` — step sequencing and TDD rules
- `references/evaluation-spec.md` — scoring and continuation gates
- `references/state-contract.md` — required state fields, including `current.phase`
- `references/progress-spec.md` — `PROGRESS.md` format and update timing
- `references/commands-spec.md` — exact command semantics
- `references/config-spec.md` — global/project config fallback rules
- `SKILL.md` — full system reference if broader pipeline context is needed
