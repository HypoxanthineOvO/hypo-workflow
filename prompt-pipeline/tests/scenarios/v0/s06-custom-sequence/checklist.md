# System Test Checklist: s06-custom-sequence

## Metadata
- Scenario: `s06-custom-sequence`
- Version: `V0`
- Goal: 验证 `custom sequence=[implement, review_code]`
- Entry Command: `开始执行`

## Preconditions
- [x] `.pipeline/config.yaml` 的 preset 为 `custom`
- [x] `sequence` 精确等于 `[implement, review_code]`

## Execution Checks
- [x] 执行顺序为 `implement -> review_code`
- [x] 不执行任何测试相关步骤
- [x] `state.yaml` 正确记录自定义 step 列表

## Artifact Checks
- [x] report 中的步骤表只有 2 行
- [x] `log.md` 只包含这 2 个步骤的记录

## Exit Criteria
- [x] review_code 仍输出 `diff_score`
- [x] evaluation 仅使用配置中的检查项

## Notes
- Status: `PASS`
- Result: `custom sequence completed`
- Remarks: 2026-04-22 复跑通过；严格按 `[implement, review_code]` 执行，没有产出任何测试步骤记录，evaluation 只使用 `matches_plan` 和 `code_quality`。
