# M10 / F004 — Preset-aware Evaluation

## 实施计划

1. 阅读 `references/evaluation-spec.md`、report templates、start/resume/report skills、现有 tests。
2. 设计 preset-aware evaluation：
   - build/TDD 继续使用 `tests_pass`、`no_regressions`、`matches_plan`、`code_quality`；
   - analysis 使用 evidence-oriented criteria。
3. 为 analysis 增加 criteria：
   - `question_addressed`
   - `evidence_complete`
   - `conclusion_traceable`
   - `experiment_executed`
   - `change_validated`
   - `followup_recorded`
4. 明确 `change_validated` 仅当 analysis 中发生代码改动时适用。
5. 更新 config schema/normalization，使当前 build checks 兼容，analysis checks 可以在 analysis preset 下启用。
6. 增加 tests，覆盖 build preset 不回归、analysis criteria 出现、non-code analysis 不强制 change validation。

## 依赖

- M08
- M09
- `references/evaluation-spec.md`
- `templates/report.md`
- `skills/report/SKILL.md`
- `skills/start/SKILL.md`

## 验证点

- 旧 build evaluation 不回归。
- analysis evaluation 不要求 TDD red/green。
- evidence completeness 和 traceability 能映射到 ledger/report。
- partial/disproved/inconclusive 的评价语义清晰。

## 约束

- 不把 analysis 的证据质量简化成 tests_pass。
- 不把所有 analysis outcome 都纳入 diff_score 的旧逻辑。

## 需求

- 更新 evaluation spec。
- 增加 preset-aware criteria。
- 更新 report/evaluation examples。

## 预期测试

- `node --test core/test/*.test.js`
- evaluation criteria tests。
- docs/spec consistency checks。
- `git diff --check`

## 预期产出

- evaluation spec updates
- schema/runtime helper updates as needed
- tests
