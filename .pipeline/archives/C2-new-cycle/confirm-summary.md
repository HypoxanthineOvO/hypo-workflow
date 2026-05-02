# C2 Plan Confirm Summary

## Project

- Name: Hypo-Workflow C2 Maintainability, Observability, Batch Plan, and Showcase
- Cycle: C2 — Maintainability, Observability, and Showcase Expansion
- Preset: tdd
- Milestones: 12
- Mode: interactive planning completed through P2; P3 artifacts generated after user confirmation.
- Language/timezone: zh-CN / Asia/Shanghai

## Scope

C2 turns Hypo-Workflow from a V9 OpenCode-compatible workflow into a more maintainable, observable, batch-capable, and presentable project.

Primary Feature groups:

1. README 自动更新：README spec、release `update_readme`、`readme-freshness`。
2. Skill 体系整理：Skill quality spec、conservative normalization、`skill-quality`。
3. Batch Plan：Feature Queue、Metrics、`/hw:plan --batch`、`/hw:plan --insert`、auto-chain、JIT。
4. OpenCode 状态面板：TUI status data adapter、sidebar/footer panels。
5. 项目技术报告与 Beamer Slides：详细技术报告、V9 Case Study、Demo script、Slides PDF。

## Generated Prompt Files

| Milestone | Feature | Prompt |
|---|---|---|
| M01 | F001 README | `.pipeline/prompts/00-readme-spec-and-data-inventory.md` |
| M02 | F001 README | `.pipeline/prompts/01-release-readme-automation-freshness.md` |
| M03 | F002 Skills | `.pipeline/prompts/02-skill-asset-audit-quality-spec.md` |
| M04 | F002 Skills | `.pipeline/prompts/03-skill-format-normalization-quality-rule.md` |
| M05 | F004 Batch | `.pipeline/prompts/04-feature-queue-and-metrics-contracts.md` |
| M06 | F004 Batch | `.pipeline/prompts/05-batch-plan-discover-upfront-decomposition.md` |
| M07 | F004 Batch | `.pipeline/prompts/06-queue-insert-auto-chain-jit.md` |
| M08 | F003 OpenCode UI | `.pipeline/prompts/07-opencode-tui-status-data-adapter.md` |
| M09 | F003 OpenCode UI | `.pipeline/prompts/08-opencode-sidebar-footer-panels.md` |
| M10 | F005 Report | `.pipeline/prompts/09-report-outline-evidence-assets.md` |
| M11 | F005 Report | `.pipeline/prompts/10-full-technical-report.md` |
| M12 | F005 Slides | `.pipeline/prompts/11-beamer-slides-demo-cycle-validation.md` |

## Validation Expectations

- Existing core tests remain green.
- Single-feature `/hw:plan` remains unchanged.
- README freshness, Skill quality, Batch queue/metrics, OpenCode artifact/TUI, and report/slides build checks are introduced during their respective Milestones.
- OpenCode TUI runtime validation may require manual smoke testing.
- Report/slides PDF compilation depends on local LaTeX tooling.

## Confirmation Required

Interactive P4 is a hard gate. Do not run `/hw:start` until the user explicitly confirms this generated plan.
