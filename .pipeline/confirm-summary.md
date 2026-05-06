# C7 Plan Confirm Summary

## 项目

- Name: Codex Service Effectiveness and Workflow Governance
- Cycle: C7
- Workflow kind: build
- Preset: tdd
- Planning mode: interactive / high
- Plan shape: single Feature, seven serial Milestones

## 核心目标

C7 将优化 Codex 和共享 Hypo-Workflow 服务效果：强化 Subagent 分工、增加 Codex 自动继续与完成前文件自检、调整 init 自动化策略、生成 Cursor/Copilot/Trae 适配文件，并把 README 改成中文优先的平台安装和 Quick Start 入口。

## Milestones

| # | Milestone | Prompt |
|---|---|---|
| M01 | Governance Spec and Automation Policy Contract | `.pipeline/prompts/00-governance-spec-and-automation-policy-contract.md` |
| M02 | Codex Subagent and Execution Discipline | `.pipeline/prompts/01-codex-subagent-and-execution-discipline.md` |
| M03 | Codex Continuation and Preflight Runtime | `.pipeline/prompts/02-codex-continuation-and-preflight-runtime.md` |
| M04 | Init Automation Levels and Non-Git Bootstrap | `.pipeline/prompts/03-init-automation-levels-and-non-git-bootstrap.md` |
| M05 | Cursor Copilot Trae Adapter Generation | `.pipeline/prompts/04-cursor-copilot-trae-adapter-generation.md` |
| M06 | Chinese README and Platform Quick Start | `.pipeline/prompts/05-chinese-readme-and-platform-quick-start.md` |
| M07 | Full Regression and Cross-Platform Smoke Readiness | `.pipeline/prompts/06-full-regression-and-cross-platform-smoke-readiness.md` |

## 验证点

- Automation level and gate policy contract.
- Subagent discipline in shared/Codex instructions, with Codex explicitly encouraged to use Subagents and testing/review separated from implementation.
- Every Milestone should use a focused Subagent review/test/docs/challenger pass when available, or report why not.
- Codex Subagent guidance must not introduce external model routing; Codex workers stay within Codex/GPT runtime assumptions.
- Lightweight proposer/challenger quality checks are included in C7; a full debate framework is deferred to C8.
- Codex continuation and preflight file checks.
- Non-git init and git-bound history import behavior.
- Cursor, Copilot, and Trae adapter generation.
- Chinese README platform install/import and Quick Start coverage.
- Full Node/Python/config/docs/generated artifact regression.

## Generated Files

- `.pipeline/design-spec.md`
- `.pipeline/PROGRESS.md`
- `.pipeline/metrics.yaml`
- `.pipeline/prompts/00-governance-spec-and-automation-policy-contract.md`
- `.pipeline/prompts/01-codex-subagent-and-execution-discipline.md`
- `.pipeline/prompts/02-codex-continuation-and-preflight-runtime.md`
- `.pipeline/prompts/03-init-automation-levels-and-non-git-bootstrap.md`
- `.pipeline/prompts/04-cursor-copilot-trae-adapter-generation.md`
- `.pipeline/prompts/05-chinese-readme-and-platform-quick-start.md`
- `.pipeline/prompts/06-full-regression-and-cross-platform-smoke-readiness.md`
- `.plan-state/discover.yaml`
- `.plan-state/decompose.yaml`
- `.plan-state/generate.yaml`

## Confirm Gate

当前处于 `plan_confirm`。确认后运行 `/hw:start` 即可从 M01 开始执行。
