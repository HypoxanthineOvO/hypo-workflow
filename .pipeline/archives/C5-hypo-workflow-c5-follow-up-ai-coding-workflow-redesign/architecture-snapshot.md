# Architecture Baseline - C5 Follow-Up AI Coding Workflow Redesign

## Current Baseline

- Active planning target: C5 follow-up after the full workflow architecture audit.
- Previous C5/M01 produced `.pipeline/audits/audit-001.md` and discussion records under `.pipeline/audits/audit-001-discussion-plan.md`.
- `.pipeline/` remains the source of truth for Cycle, state, rules, progress, logs, patches, prompts, reports, queues, metrics, knowledge, explorations, audits, and archives.
- `hypo-workflow` remains a setup, sync, planning, and global-management CLI. It is not a pipeline runner.
- Agent execution remains inside Codex, Claude Code, or OpenCode.
- OpenCode adapter artifacts are generated from core artifact helpers and templates.
- `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, and `.pipeline/rules.yaml` are protected workflow files. This P3 Generate pass does not mutate them.

## Product Direction

C5 follow-up focuses on AI Coding and code-running/software delivery workflows. Research and PhD daily workflow support remains a future major direction and is not implemented in this Cycle.

The target user experience is a simpler main path:

1. initialize or inspect a project
2. use Guide or Plan to decide the route
3. start or resume work
4. see one status phase and one next action
5. accept, reject, revise, or enter planned follow-up

Advanced lanes such as Feature DAG, Patch, Explore, Docs, Sync, and Config TUI are routed by Guide when they match the task.

## Design Principles

- Prefer runnable vertical slices over horizontal schema/core/docs-only cuts.
- Human owns design, source-of-truth choices, acceptance, and QA.
- Agent implements bounded tasks with clear prompt inputs, tests, non-goals, and validation evidence.
- Stable artifacts beat compressed conversation context. Compact views are recovery/index aids, not design authority.
- Durable design output is layered:
  - transient discussion
  - confirmed decisions
  - glossary/design concepts
  - architecture
  - prompt inputs
  - Knowledge Ledger indexes

## Core Contracts To Implement

### Cycle-Scoped Workflow Kind

`workflow_kind` is Cycle-scoped. A project may have defaults, but each Cycle owns one workflow kind that drives Plan, Decompose, Generate, Start, Report, Acceptance, Status, platform boundaries, and docs.

Initial workflow kinds:

- `build`
- `analysis`
- `showcase`

Future workflow kind:

- `research`

`cycle.type` must not remain a competing user-facing taxonomy. If retained, it should be a legacy/internal alias derived from `workflow_kind`.

### Lifecycle Policy And Continuations

Cycle lifecycle policy is generated at Cycle start or Plan Generate time. Commands must not guess defaults later.

Required policy concepts:

- reject default action
- accept next action
- resume default action
- gates
- auto-continue
- planned continuations

Planned follow-up planning uses `cycle.continuations[]`. `state.yaml` only mirrors the currently active continuation state.

Canonical user-facing phases include:

- `planning`
- `ready_to_start`
- `executing`
- `pending_acceptance`
- `needs_revision`
- `accepted`
- `follow_up_planning`
- `blocked`
- `completed`

### Consistent Lifecycle Commit

Lifecycle-mutating commands must update authoritative state and affected derived views in one consistent command flow.

The command flow must support:

- prevalidation
- temp-file atomic writes
- post-write invariant checks
- derived refresh
- explicit failure or warning when refresh fails
- repair/sync guidance

If authoritative lifecycle facts commit but a derived view refresh fails, authority remains committed and the derived failure is reported. Derived views can be rebuilt; authority must not be rolled back only because README, compact, or status-summary refresh failed.

### Guide And Adaptive Discover

Guide is the routing surface for uncertain users. It should sense current state and recommend one next path.

Plan Discover starts broad, then enters deep Grill-Me only when the task has high product, architecture, source-of-truth, or workflow semantic risk.

Durable design artifacts:

- `.pipeline/design-concepts.yaml` for machine-readable concept records.
- `.pipeline/glossary.md` for human-readable terms, examples, non-examples, and common misunderstandings.

Knowledge Ledger indexes decisions and references; it does not replace architecture, glossary, or prompts.

### Feature DAG Board

Feature Queue becomes a Feature-level DAG/board for long-running, batch, AFK, and HITL work.

Feature nodes may record:

- dependencies
- unlocks
- blocked_by
- gates
- HITL/AFK hints
- ready/blocked/running/done/needs_human/deferred states

Milestones remain serial inside a Feature by default. Milestone-level DAG scheduling is out of scope for this Cycle.

### Execution Recovery And Platform Handoff

The one-line `.pipeline/.lock` model is replaced by a structured execution lease.

The lease must include enough information to decide whether takeover is safe:

- platform
- session or agent id
- owner
- command
- workflow phase
- cycle id
- created_at
- heartbeat_at
- expires_at
- handoff_allowed

Clearly stale leases are automatically taken over and logged. Fresh foreign leases still block resume.

Platform failure hooks are best-effort evidence. Heartbeat/lease expiry is the portable recovery signal. Codex, Claude Code, and OpenCode handoff must preserve the same authorization, protected-file, gate, auto-continue, network, restart, and external-side-effect boundaries from `.pipeline` policy and generated adapters.

### Layered Global Sync

`/hw:sync` keeps its existing config, registry, adapter, context, Knowledge, and compact refresh role.

It also gains:

- authority/derived map checks
- safe derived artifact refresh
- `--check-only`
- repair/deep mode
- refresh failure reporting

Protected authority conflicts require repair or confirmation. Sync does not casually mutate `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, or `.pipeline/rules.yaml`.

### Log, Recent, And Secret-Safe Evidence

`.pipeline/log.yaml` is the complete lifecycle audit ledger. Status/dashboard Recent Events are a filtered user activity feed.

Readers must sort by timestamp and not depend on file order.

Debug, audit, report, log, status, dashboard, and Knowledge surfaces share one conservative redaction pipeline. Suspected API keys, tokens, passwords, Authorization headers, cookies, private keys, and provider credentials are redacted or blocked before durable writes.

### Documentation Governance

README is a concise user entrypoint. Full docs are split into:

- user guide
- developer guide
- platform guides
- generated references
- changelog
- license

`/hw:docs` is the explicit documentation workflow for generate/check/repair/sync.

Docs automation has three update classes:

- managed blocks can auto-update
- generated references can regenerate
- narrative docs require explicit repair/confirmation

Release must fact-check narrative docs for stale or false claims.

### Config TUI And Progress Dashboard

TUI is a configuration management interface, not a full workflow action center.

Editable domains include:

- default platform and model/model pool
- approval and sandbox defaults
- plan mode and interaction depth
- watchdog settings
- compact policy
- sync mode
- docs automation policy
- lifecycle defaults
- output language and timezone
- subagent defaults

TUI writes must show diffs, validate schema, confirm target layer, and avoid protected lifecycle files. A progress dashboard may display phase, next action, lease, recent events, derived health, and active config summary.

## Milestone Strategy

C5 follow-up uses 11 implementation milestones:

1. Workflow Kind, Lifecycle Policy, and Follow-Up Continuation Slice.
2. Consistent Lifecycle Commit and Derived Refresh Slice.
3. Guide Router, Adaptive Grill-Me, and Design Concept Artifacts.
4. Runnable Vertical Slice and TDD Execution Contract.
5. Feature DAG Board for Long-Running Work.
6. Execution Lease, Recovery, and Platform Handoff.
7. Layered Global Sync and Derived Artifact Map.
8. Log Ledger, Recent Feed, and Secret-Safe Evidence.
9. Docs Command and Documentation Information Architecture.
10. Interactive Configuration TUI and Read-Only Progress Dashboard.
11. Evidence Contracts, Metrics, and Real Lifecycle Regression.

## Validation Strategy

Each milestone must include focused tests for its own contract. M11 adds real lifecycle regression coverage across the whole redesign.

Expected final validation:

- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `node --test core/test/*.test.js`
- `python3 tests/run_regression.py`
- `git diff --check`

## Cross-Cutting Constraints

- Do not turn Hypo-Workflow into a runner.
- Keep deterministic logic in `core/`; keep judgment and execution in the host Agent.
- Keep large evidence and knowledge outside `state.yaml`.
- Treat `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, and `.pipeline/rules.yaml` as protected workflow state.
- Secret values must not be committed or written into reports, logs, status surfaces, compact context, or Knowledge records.
- Network, service restart, system dependency installation, destructive commands, and external side effects require the configured boundary or explicit confirmation.
