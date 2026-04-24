# System Test Checklist: s05-implement-only

## Metadata
- Scenario: `s05-implement-only`
- Version: `V0`
- Goal: 验证 `implement-only` 只运行 3 个步骤
- Entry Command: `开始执行`

## Preconditions
- [x] `.pipeline/config.yaml` 的 preset 为 `implement-only`
- [x] 当前 prompt 为 `00-scaffold.md`

## Execution Checks
- [x] 执行顺序为 `implement -> run_tests -> review_code`
- [x] 不执行 `write_tests`
- [x] 不执行 `review_tests`
- [x] 不执行 `run_tests_red`

## Artifact Checks
- [x] `state.yaml` 的 steps 只包含 3 个运行步骤
- [x] 报告中的步骤表只出现实现流步骤

## Exit Criteria
- [x] 运行完成后 report 仍包含 evaluation 结果
- [x] 通过时 pipeline 可继续或完成

## Notes
- Status: `PASS`
- Result: `implement-only completed`
- Remarks: 2026-04-22 复跑通过；仅执行了 `implement -> run_tests -> review_code` 三步；测试验证使用直接的 `python3` 检查脚本完成。
