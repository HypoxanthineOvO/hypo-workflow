# Architecture Baseline - C6 Claude Code Adapter Plugin and Full Workflow Takeover

## Current Baseline

- Active Cycle: C6, "Claude Code Adapter Plugin and Full Workflow Takeover".
- Workflow kind: build.
- Preset: tdd.
- Existing Claude Code support already exists through `.claude-plugin/plugin.json` and the Hypo-Workflow skill tree.
- C6 is not a rewrite of the existing Claude Code skill surface. It is an enhancement layer around the current plugin/skill model.
- `.pipeline/` remains the source of truth for Cycle, state, rules, progress, logs, prompts, reports, metrics, Knowledge, patches, and archives.
- Hypo-Workflow remains a setup, planning, sync, and adapter-generation system. It is not a runner; Claude Code performs the actual project work.
- Existing OpenCode and Codex behavior must not regress while Claude Code support improves.

## Product Direction

C6 makes Claude Code feel like a first-class Hypo-Workflow host:

1. The user can keep invoking existing `/hypo-workflow:*` skills.
2. High-frequency `/hw:*` aliases are generated as thin Claude Code skill wrappers.
3. `hypo-workflow sync --platform claude-code` installs or refreshes project-local Claude Code artifacts.
4. Existing `.claude/` configuration is preserved through managed blocks, backups, and conflict reporting.
5. Claude Code hooks reinforce the workflow state machine, especially SessionStart, Stop, compact recovery, permission flow, and progress/status refresh.
6. Claude subagents/agents are generated from the shared model role contract, with declaration-first and dynamic-selection support.
7. Status display shows a compact Progress-style view inside Claude Code where possible, with documented fallbacks.

## User Decisions From Discover

- Primary goal is workflow command and lifecycle takeover, not full proxying of every ordinary Claude Code tool call.
- Ordinary tool hooks should optimize workflow correctness: state sync, progress refresh, protected file guard, compact recovery, Stop enforcement, and permission continuity.
- Stop gates should be strict for workflow-critical evidence and state updates.
- `metrics` and derived refresh files are warnings, not hard Stop blockers.
- Subagent model routing must be first-class.
- Model defaults:
  - docs: `deepseek-v4-pro`
  - code/test: `mimo-v2.5-pro`
  - report/compact: `deepseek-v4-flash`
  - plan/review/debug: use model pool or configured Claude Code role overrides.
- Local developer profile may be permissive. Published defaults should remain conservative for destructive or external side effects.
- Safety profiles: `developer`, `standard`, and `strict`; published default is `standard`.
- Status view should show a Progress-like milestone table, basic automation/profile settings, and recent events.
- If Claude Code monitor or panel APIs are insufficient, C6 must report the limitation and provide validated alternatives.
- Final acceptance includes a manual Claude Code smoke run in a temporary fixture project, including DeepSeek and Mimo model routing.

## Adapter Layers

### Plugin And Skill Layer

- `.claude-plugin/plugin.json` remains the package entrypoint.
- Existing `/hypo-workflow:*` skills stay authoritative.
- `/hw:*` aliases are thin wrappers that load the matching existing skill and invoke the same semantics.
- Alias generation must not duplicate or fork command behavior.
- Marketplace metadata should be complete enough for validation and future publication, but C6 does not perform the actual publish action.

### Settings Merge Layer

- Project-level `.claude/settings.local.json` is the main auto-write target.
- Existing user settings are preserved.
- Hypo-Workflow writes only managed blocks or clearly marked entries.
- First mutation writes a timestamped backup.
- Re-running sync should be idempotent.
- Conflicting user-defined hooks, agents, or plugin entries should produce a diff/conflict report rather than overwrite silently.

### Hook Runtime Layer

Use shared core policy with Claude-specific wrappers.

Initial hook events:

- `SessionStart`
- `Stop`
- `PreCompact`
- `PostCompact`
- `PostToolUse`
- `PostToolBatch`
- `UserPromptSubmit`
- `PermissionRequest`
- `FileChanged` for `.pipeline/PROGRESS.md`

Compact hooks must inject a short recovery packet:

- current Cycle/Milestone/step
- next action
- required `.pipeline` files to re-read
- warning not to replay completed steps
- current automation and permission profile
- recent events

Stop hooks should block when workflow-critical evidence is missing:

- `.pipeline/state.yaml` not updated for the current step or transition
- `.pipeline/log.yaml` missing relevant lifecycle evidence
- `.pipeline/PROGRESS.md` stale after a lifecycle transition
- current milestone report missing at the final step
- Test Profile evidence missing when a profile requires it

Stop hooks should warn, not block, for:

- `metrics.yaml` gaps
- stale compact/derived views
- monitor/status refresh failure when the underlying `PROGRESS.md` is correct

### Permission And Safety Layer

The effective automation decision comes from Hypo-Workflow configuration:

1. project `.pipeline/config.yaml`
2. global `~/.hypo-workflow/config.yaml`
3. defaults

Claude Code permission settings are the host-level execution boundary.

Safety profiles:

- `developer`: permissive local development; prefer progress over friction.
- `standard`: published default; destructive or external side effects require confirmation.
- `strict`: team/CI profile; conservative asks and stronger file guard.

### Agent And Model Routing Layer

- Shared model pool remains the canonical role contract.
- Claude Code generated agents/subagents map to model roles.
- Declarations are preferred; dynamic selection refines the declared role when the milestone, Test Profile, retry/failure state, or documentation/code task type justifies it.
- Model routing must be visible in generated metadata and smoke evidence.

### Status Surface Layer

Preferred order:

1. Claude Code monitor or native status surface if available and validated.
2. `/hw:status` alias output rendered from the same Progress/status model.
3. SessionStart/Stop summary injection.
4. External Hypo-Workflow dashboard link or launch guidance.

The status model should expose:

- C6/Milestone progress table
- current phase and next action
- automation/profile settings
- recent lifecycle events
- fallback status when monitor APIs are unavailable

## Expected Code Areas

- `core/src/platform/index.js`
- `core/src/config/index.js`
- `core/src/sync/index.js`
- new Claude artifact helper under `core/src/artifacts/`
- new Claude hook policy/helper under `core/src/claude-hooks/` or equivalent
- `core/src/commands/index.js`
- `.claude-plugin/`
- generated `.claude/` fixture outputs
- `hooks/` Claude wrapper scripts where shell entrypoints are needed
- `docs/platforms/claude-code.md`
- `references/platform-claude.md`
- `references/platform-capabilities.md`
- `references/config-spec.md`
- `references/external-docs-index.md`

## Milestone Strategy

C6 uses one Feature and seven serial Milestones:

1. Claude Adapter Contract and Config.
2. Plugin Skill Alias and Marketplace Package.
3. Claude Settings Merge and Sync.
4. Claude Hook Runtime.
5. Claude Subagent Model Routing.
6. Claude Progress Status Surface.
7. Manual Smoke and Release Readiness.

## Validation Strategy

Each milestone must include focused tests before implementation. The final milestone adds a temporary-project smoke scenario.

Expected validation families:

- config/schema tests
- artifact rendering tests
- settings merge and conflict fixture tests
- Claude hook input/output fixture tests
- status model tests
- model routing tests with `deepseek-v4-pro` and `mimo-v2.5-pro`
- `claude plugin validate .`
- core regression suite
- manual Claude Code smoke checklist

## Cross-Cutting Constraints

- Do not degrade Codex or OpenCode behavior.
- Do not turn Hypo-Workflow into a model-calling runner.
- Do not overwrite user `.claude/` configuration without backup and conflict handling.
- Keep protected authority in `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, and `.pipeline/rules.yaml`.
- Keep durable facts in `.pipeline` files, not in transient chat context.
- Do not store raw secrets in logs, reports, status surfaces, or Knowledge records.
- Network, service restart, system dependency installation, destructive commands, and external side effects follow the configured safety profile or require explicit confirmation.
