# Architecture Baseline — C3 OpenCode Multi-Agent Matrix and V10 Analysis Preset

## Current Baseline

- Active Cycle: C3, completed and awaiting archive.
- Previous Cycle C1 delivered V9 OpenCode Native Adapter and is archived.
- Previous Cycle C2 delivered maintainability, observability, Batch Plan, Chat Mode, Progressive Discover, Test Profiles, OpenCode status panels, and showcase/report assets.
- `.pipeline/` remains the source of truth for Cycle, state, rules, progress, logs, patches, prompts, reports, queue, and metrics.
- Protected files remain `.pipeline/state.yaml`, `.pipeline/cycle.yaml`, and `.pipeline/rules.yaml`.
- Compact files are intentionally not regenerated in this C3 plan generation pass.
- Cross-cycle external source discovery is indexed in `references/external-docs-index.md`.

## C3 Architecture Direction

C3 delivered two major directions:

1. OpenCode Multi-Agent Model Matrix.
2. V10 Analysis Preset.

The first extends the OpenCode adapter and sync artifact layer. The second extends Hypo-Workflow from a build-focused engine into a general workflow engine that can run investigations and produce traceable conclusions.

## Plan Review 2026-05-02

This review reconciles the generated C3 baseline with the implemented C3 artifacts and the current official OpenCode documentation surface.

| Field | Review |
|---|---|
| ADDED | C3 now has implemented model matrix defaults/schema/rendering, OpenCode role agents, provider-qualified model IDs, TUI model visibility, analysis preset runtime helpers, analysis ledger/report templates, preset-aware evaluation, and scenario coverage. |
| CHANGED | The baseline moved from planned C3 architecture to completed C3 architecture. OpenCode integration is no longer only V9 parity plus planned model routing; it is a synced matrix surface backed by generated agents and sidecar metadata. |
| REASON | C3 M01-M12 and P005 changed project reality after the original architecture baseline was written. Models also need a durable official-doc lookup path for OpenCode APIs, config, agent behavior, MCP docs access, and server/SDK surfaces. |
| IMPACT | Future planning, archive summaries, and OpenCode adapter changes should read this file plus `references/external-docs-index.md` and `references/opencode-spec.md` before changing generated artifacts, agent model routing, TUI status, or documentation lookup behavior. |

Downstream prompt review: C3 has no remaining active downstream prompts. No `.plan-state/prompt-patch-queue.yaml` edits are required for stale prompt assumptions; the next mutation should be `/hw:cycle close`.

## Core Layering

- Cycle: delivery container.
- Feature Queue: multi-feature scheduling layer.
- Milestone: executable unit.
- Preset: step sequence.
- Test Profile: validation policy composed with a preset.
- Interaction Mode: controls human/agent collaboration and permission behavior.
- Evidence Ledger: analysis-specific structured evidence chain.

`analysis` must not be implemented as a Test Profile. It is a preset with different execution semantics and report requirements.

## OpenCode Model Matrix

OpenCode model routing is now a first-class config/sync surface:

- planning agent can use a frontier model;
- compaction can use a cheaper Flash-class model;
- TDD work can route testing, code worker A/B, debug/review, and report writing to distinct OpenCode agents;
- agent-level compaction settings should render deterministically into OpenCode artifacts;
- generated artifacts must stay OpenCode-native and schema-compatible.

Hypo-Workflow remains a setup/sync layer. It should not call models directly as a runner.

Official OpenCode docs currently anchor this surface:

- `https://opencode.ai/docs/config/` for merged config precedence, project `opencode.json`, `.opencode/` directories, and `https://opencode.ai/config.json`.
- `https://opencode.ai/docs/agents/` for primary agents, subagents, agent frontmatter options, model overrides, mode, and permissions.
- `https://opencode.ai/docs/models/` for provider/model IDs, variants, and model option inheritance.
- `https://opencode.ai/docs/cli/` for `opencode models --refresh`, `opencode run`, `opencode serve`, and `--model provider/model` usage.
- `https://opencode.ai/docs/server/` and `https://opencode.ai/docs/sdk/` for programmatic HTTP/OpenAPI/SDK integration.
- `https://opencode.ai/docs/mcp-servers/` for optional docs lookup through MCP, including Context7.

## Analysis Preset

The V10 Analysis Preset step chain is:

```text
define_question -> gather_context -> hypothesize -> experiment -> interpret -> conclude
```

Primary use cases:

- root-cause/debug analysis;
- metric/research analysis;
- repo/system analysis.

The first release should prioritize root-cause investigation while keeping the ledger/report structure broad enough for the other two.

## Interaction Model

Public mode names:

- `manual`
- `hybrid`
- `auto`

Initial behavior:

- `manual`: collect context, propose, and report; do not modify code.
- `hybrid`: propose code changes and wait for approval before modifying code.
- `auto`: may modify code and validate in the same analysis Milestone.

Boundary defaults:

- installing system-level dependencies: ask;
- restarting services: confirm;
- network/proxy/remote resources: owner `auto` may allow, published `hybrid` should ask/confirm;
- destructive or external side-effect actions: require confirmation.

## State And Ledger

Keep `.pipeline/state.yaml` as the linear execution pointer. Do not model hypothesis backtracking as step rollback.

Analysis state should only add a lightweight summary such as:

```yaml
analysis:
  question_id: Q1
  analysis_kind: root_cause
  interaction_mode: auto
  active_hypothesis_id: H2
  active_experiment_id: E3
  outcome: null
```

Full evidence belongs in per-Milestone ledgers:

```text
.pipeline/analysis/<milestone-id>-analysis-ledger.yaml
```

The ledger must include question, environment snapshot, hypotheses, experiments, observations, metrics, interpretation, conclusion, confidence, next actions, code change refs, threats to validity, and ruled-out alternatives.

## Outcomes

Hypothesis statuses:

- `pending`
- `confirmed`
- `disproved`
- `partial`

Milestone outcomes:

- `confirmed`
- `partial`
- `disproved`
- `inconclusive`
- `blocked`

A disproved hypothesis is normal progress, not a failed Milestone. A disproved Milestone means the main suspected direction was ruled out and no replacement conclusion was confirmed in that Milestone.

## Reports And Evaluation

Build reports continue to use build-centric evaluation. Analysis reports must be preset-aware and focus on traceability:

- question addressed;
- evidence completeness;
- conclusion traceability;
- experiment execution;
- change validation when code changed;
- follow-up recording.

Analysis reports should be usable as input to a later Build Cycle.

## Completed Milestones

| Milestone | Feature | Prompt |
|---|---|---|
| M01 | F001 Model Matrix | `00-opencode-model-matrix-contract-schema.md` |
| M02 | F001 Model Matrix | `01-opencode-artifact-rendering-sync.md` |
| M03 | F001 Model Matrix | `02-opencode-model-matrix-validation-docs.md` |
| M04 | F002 Analysis Core | `03-analysis-preset-workflow-taxonomy.md` |
| M05 | F002 Analysis Core | `04-analysis-interaction-boundaries.md` |
| M06 | F003 Analysis Runtime | `05-analysis-state-ledger-format.md` |
| M07 | F003 Analysis Runtime | `06-analysis-experiment-execution-contract.md` |
| M08 | F003 Analysis Runtime | `07-analysis-outcome-handoff.md` |
| M09 | F004 Analysis Templates | `08-analysis-report-evidence-templates.md` |
| M10 | F004 Analysis Templates | `09-preset-aware-evaluation.md` |
| M11 | F005 Integration | `10-analysis-planning-generate-integration.md` |
| M12 | F005 Integration | `11-queue-auto-continue-docs-regression.md` |

## Review Expectations

- Keep implementation steps narrow enough that each Milestone can add tests before code.
- Run targeted tests plus `node --test core/test/*.test.js` after implementation milestones.
- Run scenario regression where a Milestone changes plan, config, OpenCode artifact generation, or runtime state semantics.
- Ensure no C3 Feature is generated with `gate: confirm`.
