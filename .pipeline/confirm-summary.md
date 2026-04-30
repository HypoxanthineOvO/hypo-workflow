# V9 Plan Confirm Summary

## Project

- Name: Hypo-Workflow V9 OpenCode Native Adapter
- Cycle: C1 — V9 OpenCode Native Adapter
- Preset: tdd
- Milestones: 10
- Mode: interactive planning completed through P2; P3 artifacts generated after user confirmation.

## Scope

V9 adds OpenCode as a first-class platform while preserving Codex and Claude Code behavior.

Primary deliverables:

- OpenCode capability and mapping specs
- shared deterministic `core/` kernel
- global `hypo-workflow` setup CLI/TUI
- `plugins/opencode/` adapter
- OpenCode command/agent/rules/permissions/event integration
- default-on safe auto continue for OpenCode
- full V8.4 command parity
- stronger Codex/Claude Plan discipline

## Generated Prompt Files

| Milestone | Prompt |
|---|---|
| M0 | `.pipeline/prompts/00-v9-architecture-and-capability-matrix.md` |
| M1 | `.pipeline/prompts/01-core-shared-config-and-artifact-kernel.md` |
| M2 | `.pipeline/prompts/02-global-cli-tui-setup.md` |
| M3 | `.pipeline/prompts/03-opencode-plugin-scaffold-and-project-adapter.md` |
| M4 | `.pipeline/prompts/04-opencode-slash-command-mapping.md` |
| M5 | `.pipeline/prompts/05-opencode-agents-ask-todowrite-plan-discipline.md` |
| M6 | `.pipeline/prompts/06-opencode-events-auto-continue-context-file-guard.md` |
| M7 | `.pipeline/prompts/07-opencode-full-v84-parity.md` |
| M8 | `.pipeline/prompts/08-v9-regression-and-smoke-tests.md` |
| M9 | `.pipeline/prompts/09-v9-docs-bootstrap-and-release.md` |

## Confirmation Required

Interactive P4 is a hard gate. Do not run `/hw:start` until the user explicitly confirms this generated plan.
