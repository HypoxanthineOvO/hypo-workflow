# C3 Design Spec — OpenCode Multi-Agent Matrix and V10 Analysis Preset

## Goal

- Deliver the original C3 OpenCode Multi-Agent Model Matrix.
- Add V10 Analysis Preset as a first-class Hypo-Workflow lane for root-cause analysis, metric/research analysis, and repo/system analysis.
- Keep C3 fully auto-continuing: no Feature gate should be generated.

## Project Shape

- Project type: Hypo-Workflow feature cycle.
- Primary deliverable: source changes, specs, templates, tests, and docs.
- Target platform: Codex, OpenCode, Claude Code compatibility where relevant.
- Expected users: the project owner first, then published users who need hybrid analysis workflows.

## Constraints

- `.pipeline/` remains the workflow source of truth.
- Hypo-Workflow remains a setup/sync/workflow harness, not a model-calling runner.
- Current active config must stay schema-valid until the schema is deliberately extended in C3.
- `compact` files are intentionally left untouched for this plan generation.
- C3 queue behavior must use `auto_chain: true`, `default_gate: auto`, and per-Feature `gate: auto`.

## Existing Context

- C1 delivered V9 OpenCode Native Adapter.
- C2 delivered README automation, Skill governance, Batch Plan, Chat Mode, Progressive Discover, Test Profiles, OpenCode status panels, and showcase/report work.
- The archived next-cycle draft introduced F001: OpenCode Multi-Agent Model Matrix.
- The V10 design discussion adds Analysis Preset as a new major direction.

## Functional Requirements

- OpenCode model matrix:
  - configure role-specific models for planning, compaction, test, code workers, debug/review, and report writing;
  - render deterministic OpenCode artifacts through `hypo-workflow sync --platform opencode`;
  - support an effective 900K-token compaction target.
- Analysis Preset:
  - add workflow steps: `define_question`, `gather_context`, `hypothesize`, `experiment`, `interpret`, `conclude`;
  - support `manual`, `hybrid`, and `auto` interaction modes;
  - support real experiment execution;
  - record structured evidence ledgers;
  - produce traceable analysis reports;
  - allow same-milestone fixes when mode/boundary permits;
  - generate follow-up proposals for build cycles when needed.

## Testing Expectations

- Keep existing core Node tests and regression scenarios green.
- Add targeted tests for config/schema/model matrix rendering.
- Add targeted tests for analysis preset selection, templates, state summary, ledger schema, outcome semantics, evaluation, and planning generation.
- Ensure old `tdd`, `implement-only`, and `custom` projects remain compatible.
- Validate C3 queue has no `gate: confirm`.

## Milestone Strategy

- Proposed milestone count: 12.
- Expected execution preset for implementing C3: `tdd`.
- New runtime preset being built: `analysis`.
- Feature split:
  - F001 OpenCode Multi-Agent Model Matrix.
  - F002 Analysis Preset Core Contract.
  - F003 Analysis Runtime, State, and Ledger.
  - F004 Analysis Reports, Templates, and Evaluation.
  - F005 Planning, Queue, and Runtime Integration.

## Analysis Preset Decisions

- One analysis Milestone represents one investigation question.
- A Milestone may contain multiple hypotheses.
- Hypothesis exploration is ledger-driven, not state-machine rollback.
- First runtime implementation can execute hypotheses serially while preserving a multi-hypothesis ledger model.
- `environment_snapshot` is mandatory for V10 Analysis.
- Analysis can modify code in the same Milestone according to interaction mode:
  - `manual`: deny code changes;
  - `hybrid`: confirm fix proposal first;
  - `auto`: allow direct changes.
- Installing system-level dependencies requires asking.
- Restarting services requires confirmation.
- Network/proxy/remote resource access defaults to allow for owner `auto`, ask/confirm for published `hybrid`.

## Open Questions

- No blocking P3 questions remain.
- External network/proxy defaults are accepted as generated-plan assumptions unless changed later.
