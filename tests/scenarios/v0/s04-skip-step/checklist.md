# System Test Checklist: s04-skip-step

## Metadata
- Scenario: `s04-skip-step`
- Version: `V0`
- Goal: 验证 `skip step` 跳过当前子步骤
- Entry Command: `跳过当前步骤`

## Preconditions
- [x] 标准 `tdd` preset
- [x] 当前 prompt 为 `00-scaffold.md`
- [x] 当前步骤为 `write_tests`

## Execution Checks
- [x] 执行 `skip step` 后 `write_tests` 被标记为 `skipped`
- [ ] `state.yaml` 中当前步骤推进到 `review_tests`
- [x] `log.md` 追加跳过记录

## Artifact Checks
- [x] 跳步不会删除已有 state
- [ ] 后续步骤仍按顺序继续执行

## Exit Criteria
- [ ] pipeline 保持可恢复状态
- [x] 报告或日志中能看出该步骤被跳过

## Notes
- Status: `FAIL`
- Result: `blocked`
- Remarks: 2026-04-22 按当前 SKILL.md 复跑时，`skip step` 从 `write_tests` 级联跳过了 `review_tests` 和 `run_tests_red`，导致 `run_tests_green` 在严格模式下因缺少 `tests/` 而阻塞，未能保持 V0 的可恢复行为。
