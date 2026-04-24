# System Test Checklist: s07-full-hypo-todo

## Metadata
- Scenario: `s07-full-hypo-todo`
- Version: `V0.5`
- Goal: 验证完整 4 轮 prompt 循环
- Entry Command: `开始执行`

## Preconditions
- [x] 使用标准 `tdd` preset
- [x] 已提供 `00-scaffold.md` 到 `03-export.md` 共 4 个 prompt
- [x] 每个 prompt 都包含 `需求`、`预期测试`、`预期产出`

## Execution Checks
- [x] 共执行 4 轮 prompt
- [x] 每轮执行 `write_tests -> review_tests -> run_tests_red -> implement -> run_tests_green -> review_code`
- [x] 当前 prompt 完成后正确推进到下一轮
- [x] `history.completed_prompts` 最终记录 4 个条目

## Artifact Checks
- [x] 生成 4 份 report
- [x] `log.md` 包含 24 个步骤级日志项
- [x] `state.yaml` 最终状态为 `completed`

## Exit Criteria
- [x] 累计 16 个测试全部通过
- [x] 无 regressions
- [x] 最终 diff_score 不高于 `3`

## Notes
- Status: `PASS`
- Result: `completed`
- Remarks: 2026-04-22 按 4 轮 TDD + auto_continue 执行完成；最终全量测试为 `18 passed`，其中增量功能测试按 prompt 统计为 `16`（`8 + 3 + 5`），另含 scaffold 的 `2` 个基础 CLI 测试。
