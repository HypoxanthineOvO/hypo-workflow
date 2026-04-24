# System Test Checklist: s01-fresh-start

## Metadata
- Scenario: `s01-fresh-start`
- Version: `V0`
- Goal: 验证从空状态启动标准 TDD preset
- Entry Command: `开始执行`

## Preconditions
- [x] `.pipeline/config.yaml` 存在且 preset 为 `tdd`
- [x] `.pipeline/prompts/00-scaffold.md` 存在
- [x] 初始不存在 `.pipeline/state.yaml`
- [x] `results/` 目录为空

## Execution Checks
- [x] 首次启动时从 `00-scaffold.md` 开始
- [x] 子步骤顺序为 `write_tests -> review_tests -> run_tests_red -> implement -> run_tests_green -> review_code`
- [x] 每一步结束后更新 `state.yaml`
- [x] 每一步结束后追加写入 `log.md`

## Artifact Checks
- [x] 生成 `.pipeline/state.yaml`
- [x] 生成 `.pipeline/log.md`
- [x] 生成 `.pipeline/reports/00-scaffold.report.md`
- [x] report 中包含步骤表、测试结果和 diff_score

## Exit Criteria
- [x] pipeline 停在 prompt 完成后的可继续状态
- [x] diff_score 小于等于 `3`

## Notes
- Status: `PASS`
- Result: `completed`
- Remarks: 2026-04-22 复跑通过；先清理遗留产物恢复 fresh-start 前置条件，再按标准 TDD 六步完成，最终 `diff_score=1`。
