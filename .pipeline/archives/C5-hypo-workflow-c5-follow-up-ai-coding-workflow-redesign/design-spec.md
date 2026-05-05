# C5 Follow-Up Design Spec - AI Coding Workflow Redesign

## Product Scope

C5 follow-up focuses on the AI Coding and code-running workflow. Research and PhD daily workflow support remains a vNext direction and is not implemented in this Cycle.

## Core Decisions

- `workflow_kind` is Cycle-scoped. A project may have defaults, but each Cycle owns one workflow kind that drives planning, execution, status, reporting, acceptance, and platform boundary semantics.
- Follow-up planning is a planned Cycle continuation, not ordinary `plan:extend`. The preferred schema shape is `cycle.continuations[]`.
- Rejecting accepted work defaults to `needs_revision`; `/hw:resume` continues the revision unless the user explicitly aborts, abandons, or replans.
- Lifecycle policy is decided at Cycle start or Plan Generate time. Commands should not guess accept/reject/resume/auto-continue behavior at runtime.
- Plan Discover supports adaptive Grill-Me. Guide and the early broad questions decide whether deep design-concept alignment is needed.
- Grill-Me outputs are layered into transient discussion, durable decisions, glossary/design concepts, architecture, prompt inputs, and Knowledge Ledger indexes.
- Feature Queue becomes a Feature-level DAG/board for long-running and batch work. Milestones remain serial inside a Feature by default.
- Milestones should be runnable vertical slices: narrow end-to-end behavior with real validation, not horizontal schema/core/docs-only cuts.
- Lifecycle-mutating commands must update authoritative state and affected derived views in one consistent command flow.
- `/hw:sync` becomes layered global sync: existing config/registry/adapter/context refresh plus authority/derived checks and safe derived artifact refresh.
- Recovery uses structured execution leases and heartbeat/lease expiry as the portable signal. Platform failure hooks are best-effort evidence only.
- Log is a complete audit ledger; status/dashboard Recent is a filtered user activity feed.
- Debug/audit/report/log/status/dashboard/Knowledge surfaces share a conservative secret-safe evidence pipeline.
- README is a concise user entrypoint. Full user docs, developer docs, platform docs, generated references, changelog, and license have separate ownership.
- TUI is a configuration management UI, not a full workflow action center. Progress dashboard is read-only or command-suggesting first.

## Main Path

Ordinary AI Coding should remain understandable:

1. `/hw:init` or existing project discovery.
2. `/hw:guide` or `/hw:plan`.
3. `/hw:start`.
4. `/hw:status` / `/hw:resume`.
5. `/hw:accept` / `/hw:reject`.

Batch, Feature DAG, Explore, Patch, Docs, Sync, and Dashboard are routed by Guide when they match the task.

## Validation Strategy

Each milestone must add focused tests for its behavior. The final milestone expands regression to cover real lifecycle scenarios: stale lease takeover, heartbeat timeout, compact resume, platform handoff, reject revision, accept follow-up continuation, sync derived repair, workflow kind consistency, and metrics telemetry gaps.
