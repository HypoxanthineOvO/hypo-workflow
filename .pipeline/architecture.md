# Architecture Baseline - C4 Knowledge Ledger, Global TUI, Acceptance Loop, and Explore Mode

## Current Baseline

- Active Cycle: C4.
- Previous Cycle C3 delivered OpenCode multi-agent model matrix and V10 Analysis Preset.
- `.pipeline/` remains the project source of truth for Cycle, state, rules, progress, logs, patches, prompts, reports, queues, metrics, knowledge, explorations, and archives.
- `hypo-workflow` remains a setup/sync/global-management CLI, not a pipeline runner.
- Agent execution remains inside Codex, Claude Code, or OpenCode.
- OpenCode adapter artifacts are generated from `core/src/artifacts/opencode.js` and templates under `plugins/opencode/templates/`.

## C4 Architecture Direction

C4 adds four large capabilities:

1. Knowledge Ledger for cross-session project memory.
2. Global management TUI built with Ink.
3. Manual acceptance and rejection loops for Cycle and Patch lifecycles.
4. Explore Mode with isolated global git worktrees and standardized sync.

The features are planned as a Batch Feature Queue. `F001` must finish first and pause before `F002`, because Knowledge Ledger and OpenCode workflow-control hooks become the foundation for the remaining C4 work.

## Cross-Cutting Constraints

- Do not turn Hypo-Workflow into a runner.
- Keep deterministic logic in `core/`; keep judgment and execution in the host Agent.
- Keep large evidence and knowledge outside `state.yaml`.
- Treat `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, and `.pipeline/rules.yaml` as protected workflow state.
- Published defaults should be conservative: OpenCode auto-continue defaults to `safe`.
- Local automation profile may use `aggressive`; strict/team profile should use `ask`.
- Secret values must not be committed. Real API keys belong in `~/.hypo-workflow/secrets.yaml`; project knowledge records may reference env var names and redacted usage only.
- OpenCode Explore worktrees may be allowed under `~/.hypo-workflow/worktrees/**`; this allowance must not extend to `~/.hypo-workflow/secrets.yaml` or global config files.

## F001 Knowledge Ledger And OpenCode Hooks

Knowledge storage uses three layers:

- raw session records under `.pipeline/knowledge/records/`
- generated category indexes under `.pipeline/knowledge/index/`
- compact context under `.pipeline/knowledge/knowledge.compact.md`

Knowledge categories:

- dependencies: library name, version, reason, official docs, adoption context
- references: official docs and API references consulted
- pitfalls: issue, symptoms, root cause, fix, prevention
- decisions: lightweight ADRs and architecture choices
- config notes: external service setup, env var names, smoke requirements
- secret refs: redacted references to secrets stored outside the repo

SessionStart must load compact knowledge and index only. Full records are opened on demand.

OpenCode workflow-control hooks must move beyond scaffold:

- export pure policy functions for file guard, permission decisions, auto-continue, stop-equivalent checks, and event serialization
- handle `file`, `path`, and `filePath` style tool args
- record permission events when they affect HW state
- use fixture tests plus actual OpenCode smoke

## F002 Global TUI

The global TUI is a true terminal UI built with Ink in the existing Node CLI stack.

It manages:

- model pool roles: Plan, Implement, Review, Evaluate, Chat
- fallback chains for model roles
- mapping to OpenCode agent matrix
- global defaults under `~/.hypo-workflow/config.yaml`
- project registry under `~/.hypo-workflow/projects.yaml`
- project add, scan, sync, and status overview

Migration is lazy. Missing fields fall back at runtime. The first write through TUI creates a backup before saving.

## F003 Acceptance Loop

Cycle acceptance:

- all milestones complete -> `cycle.status=pending_acceptance`
- `state.yaml` may mirror runtime status for status/TUI, but `cycle.yaml` is authoritative
- `/hw:accept` archives and closes normally
- `/hw:reject` records structured feedback and reopens work

Patch acceptance:

- patch fix may enter pending acceptance instead of direct close in manual mode
- `/hw:patch accept P001` closes
- `/hw:patch reject P001 "feedback"` reopens and increments iteration
- repeated rejection recommends escalation to Cycle

Reject feedback is always stored structurally with problem, reproduction steps, expected behavior, actual behavior, context, and iteration.

`PROGRESS.md`, status, log, and OpenCode TUI must display acceptance state clearly.

## F004 Explore Mode And Sync

Explore Mode:

- metadata under `.pipeline/explorations/E001-slug/`
- code worktree under `~/.hypo-workflow/worktrees/<project-id>/E001-slug/`
- branch name `explore/E001-slug`
- dirty main worktree requires a user decision
- ending an exploration keeps the branch/worktree unless deletion is explicitly confirmed

Explore outcomes:

- archive only
- upgrade to Build Cycle through `/hw:plan --context explore:E001`
- upgrade to Analysis for deeper validation

Sync:

- `/hw:sync --light`: registry, compact hints, knowledge index, external-change prompt
- `/hw:sync`: light + adapter sync + config/schema checks
- `/hw:sync --deep`: standard + architecture/dependency scan
- SessionStart runs light detection only and avoids heavy mutations.

## Validation Strategy

Required C4 validation:

- `node --test core/test/*.test.js`
- `python tests/run_regression.py`
- hook script tests
- CLI and TUI smoke tests
- OpenCode artifact sync tests
- actual OpenCode smoke for command mapping, agent matrix, permissions, file guard, auto-continue, stop-equivalent behavior, and TUI status
- manual smoke records must be captured in Knowledge Ledger

## Milestone Strategy

C4 uses 14 milestones:

- M01-M05: Knowledge Ledger and OpenCode workflow-control hooks
- M06-M08: Global config, project registry, and Ink TUI
- M09-M11: Acceptance lifecycle
- M12-M14: Explore Mode and sync

Expected preset: `tdd`.
