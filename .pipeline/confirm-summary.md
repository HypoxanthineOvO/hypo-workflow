# C3 Plan Confirm Summary

## Project

- Name: Hypo-Workflow C3 OpenCode Multi-Agent Matrix and V10 Analysis Preset
- Cycle: C3 — OpenCode Multi-Agent Matrix and V10 Analysis Preset
- Implementation preset: tdd
- New workflow preset being delivered: analysis
- Milestones: 12
- Mode: auto planning and auto queue continuation
- Language/timezone: zh-CN / Asia/Shanghai

## Scope

C3 delivers:

1. OpenCode multi-agent model matrix and agent compaction configuration.
2. V10 Analysis Preset with real experiment execution, interaction modes, evidence ledger, analysis reports, evaluation, and planning/runtime integration.

## Generated Prompt Files

| Milestone | Feature | Prompt |
|---|---|---|
| M01 | F001 Model Matrix | `.pipeline/prompts/00-opencode-model-matrix-contract-schema.md` |
| M02 | F001 Model Matrix | `.pipeline/prompts/01-opencode-artifact-rendering-sync.md` |
| M03 | F001 Model Matrix | `.pipeline/prompts/02-opencode-model-matrix-validation-docs.md` |
| M04 | F002 Analysis Core | `.pipeline/prompts/03-analysis-preset-workflow-taxonomy.md` |
| M05 | F002 Analysis Core | `.pipeline/prompts/04-analysis-interaction-boundaries.md` |
| M06 | F003 Analysis Runtime | `.pipeline/prompts/05-analysis-state-ledger-format.md` |
| M07 | F003 Analysis Runtime | `.pipeline/prompts/06-analysis-experiment-execution-contract.md` |
| M08 | F003 Analysis Runtime | `.pipeline/prompts/07-analysis-outcome-handoff.md` |
| M09 | F004 Analysis Templates | `.pipeline/prompts/08-analysis-report-evidence-templates.md` |
| M10 | F004 Analysis Templates | `.pipeline/prompts/09-preset-aware-evaluation.md` |
| M11 | F005 Integration | `.pipeline/prompts/10-analysis-planning-generate-integration.md` |
| M12 | F005 Integration | `.pipeline/prompts/11-queue-auto-continue-docs-regression.md` |

## Queue Policy

- `auto_chain: true`
- `default_gate: auto`
- every C3 Feature uses `gate: auto`
- no `gate: confirm` is generated

## Validation Expectations

- Existing core tests remain green.
- Existing `tdd`, `implement-only`, and `custom` behavior remains compatible.
- OpenCode artifact generation remains deterministic and schema-compatible.
- Analysis preset adds its own ledger/report/evaluation semantics without replacing build reports.
- C3 final validation must prove no generated queue entry uses a confirm gate.

## P4 Behavior

Project config sets `plan.mode: auto`, so P4 is a summary checkpoint rather than a hard confirmation gate.
