# M11 / F005 — Planning and Generate Integration

## 实施计划

1. 阅读 plan skills、`plan/PLAN-SKILL.md`、`core/src/progressive-discover/index.js`、`core/src/batch-plan/index.js`、prompt generation templates。
2. 将 `workflow_kind` 和 `analysis_kind` 接入 Discover/Decompose/Generate。
3. 更新 `/hw:plan` guidance：
   - root-cause/debug analysis；
   - metric/research analysis；
   - repo/system analysis。
4. 更新 P2 decomposition guidance，使 analysis Milestone 以“一个问题”为单位，并允许多个 hypotheses。
5. 更新 P3 generation，使 `execution.steps.preset: analysis` 时选择 analysis prompt templates 和 report/evaluation guidance。
6. 保持单功能 build plan、batch plan、insert、plan-extend 兼容。
7. 增加 tests，覆盖 analysis plan generation、batch analysis feature、legacy tdd generation。

## 依赖

- M04-M10
- `skills/plan/SKILL.md`
- `skills/plan-discover/SKILL.md`
- `skills/plan-decompose/SKILL.md`
- `skills/plan-generate/SKILL.md`
- `core/src/progressive-discover/index.js`
- `core/src/batch-plan/index.js`
- `plan/assets/prompt-template.md`

## 验证点

- Plan 可以识别 analysis 工作，而不是误判为 implement-only。
- analysis prompt 包含 define question / gather context / hypothesize / experiment / interpret / conclude。
- batch queue 中 analysis Feature 可以 upfront decomposition。
- 旧 build plan 生成不变。

## 约束

- 不跳过 interactive planning 的既有安全规则，除非 config 明确 `plan.mode: auto`。
- 不把 analysis_kind 和 test_profiles 混为一层。

## 需求

- Plan Discover/Decompose/Generate 接入 analysis。
- Prompt generation preset-aware。
- Batch plan artifact 支持 analysis fields。

## 预期测试

- `node --test core/test/*.test.js`
- plan/batch artifact tests。
- scenario regression for analysis planning path。
- `git diff --check`

## 预期产出

- plan skill/spec updates
- runtime/helper updates
- tests/scenarios
