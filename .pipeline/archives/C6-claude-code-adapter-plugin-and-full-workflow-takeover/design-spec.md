# C6 Design Spec - Claude Code Adapter Plugin and Full Workflow Takeover

## Product Scope

C6 upgrades Claude Code support from a thin plugin/skill compatibility surface into a first-class Hypo-Workflow host integration. The Cycle focuses on existing Claude Code plugin support, `/hw:*` aliases, project-local settings merge, hooks, subagent model routing, Progress-style status display, and a manual smoke flow.

Out of scope for the main path:

- replacing the existing `/hypo-workflow:*` skill tree
- turning Hypo-Workflow into an independent runner
- full proxying of every Claude Code tool call
- marketplace publication as an external side effect
- MCP/LSP deep integration beyond documenting future paths
- Worktree hook automation beyond initial notes

## Primary Experience

The desired user experience is:

1. A user installs or syncs the Claude Code adapter.
2. Existing `/hypo-workflow:*` skills continue to work.
3. The user can also use familiar `/hw:*` aliases.
4. Project `.claude/settings.local.json` is updated safely and idempotently.
5. Claude hooks keep the workflow recoverable across session start, stop, permission decisions, and compact events.
6. Claude subagents use configured role models, including DeepSeek and Mimo.
7. Claude Code can show a compact Progress-like status view or a documented fallback.
8. A temporary fixture project can be manually run to verify the whole adapter.

## Confirmed Decisions

- Use a single Feature with seven Milestones rather than a Feature Queue.
- Keep current Claude plugin/Skill behavior and enhance it.
- Generate `/hw:*` aliases as lightweight wrappers around the existing skills.
- Use `.claude/settings.local.json` as the main project-local auto-write target.
- Preserve existing `.claude/` settings through backups, managed blocks, idempotent merge, and conflict reporting.
- Use shared core policy plus Claude-specific hook wrappers.
- Stop hook should block strict workflow-critical gaps.
- `metrics` and derived refresh gaps are warnings.
- Compact hooks must inject resume-oriented state so Claude Code continues from saved workflow state.
- Permission hooks should continue automation when effective Hypo-Workflow config allows it.
- Local developer profile may be permissive; published default should require confirmation for destructive or important external side effects.
- Safety profiles are `developer`, `standard`, and `strict`.
- Status display should include the milestone table, automation/profile basics, and recent events.
- If Claude Code monitor or panel APIs are limited, report the limitation and validate fallback options.
- Final validation includes a user-run manual smoke in a temporary fixture project.

## Model Routing Policy

Declaration first, dynamic refinement second.

Default role mapping:

| Role | Default model |
|---|---|
| docs | `deepseek-v4-pro` |
| code/test | `mimo-v2.5-pro` |
| report/compact | `deepseek-v4-flash` |
| plan/review/debug | shared model pool or explicit Claude Code override |

Dynamic selection may use:

- Milestone category
- Test Profile
- failure/retry state
- documentation vs implementation vs validation step
- context-size or compact pressure

Dynamic selection must be visible in generated metadata or smoke evidence.

## Hook Policy

Initial hook events:

- `SessionStart`
- `Stop`
- `PreCompact`
- `PostCompact`
- `PostToolUse`
- `PostToolBatch`
- `UserPromptSubmit`
- `PermissionRequest`
- `FileChanged(.pipeline/PROGRESS.md)`

Hard Stop blockers:

- missing or stale authoritative state for an active transition
- missing lifecycle log evidence
- stale Progress after a lifecycle transition
- missing final milestone report
- missing required Test Profile evidence

Warnings:

- metrics gaps
- stale compact/derived files
- status/monitor refresh failure when core Progress is correct

## Status Surface

The first usable surface must render:

- current Cycle and phase
- milestone/progress table equivalent to the useful part of `PROGRESS.md`
- automation settings and safety profile
- recent events
- next action

Fallback order:

1. Claude Code monitor/status surface.
2. `/hw:status` alias output.
3. SessionStart/Stop injected summary.
4. External dashboard link or launch guidance.

## Validation Strategy

Every implementation Milestone follows TDD:

1. write tests
2. review tests
3. run red
4. implement
5. run green
6. review code and evidence

Final validation must include:

- `bash scripts/validate-config.sh .pipeline/config.yaml`
- focused `node --test core/test/<claude-*.test.js>` suites
- `node --test core/test/*.test.js`
- `python3 tests/run_regression.py`
- `claude plugin validate .`
- JSON/YAML parse checks
- `git diff --check`
- manual Claude Code smoke checklist in a temporary fixture project

## Open Risks

- Claude Code monitor/panel APIs may not support a true live panel. C6 must validate and document fallback behavior.
- Claude Code plugin alias naming may have constraints; aliases must be validated rather than assumed.
- Claude Code hook output contracts are event-sensitive and exit-code-sensitive.
- User `.claude/` config must not be overwritten or reordered destructively.
- Provider/model IDs can drift; C6 should preserve configured IDs and avoid hardcoded provider assumptions where possible.
