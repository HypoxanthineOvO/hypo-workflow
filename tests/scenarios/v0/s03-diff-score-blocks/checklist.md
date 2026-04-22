# System Test Checklist: s03-diff-score-blocks

## Metadata
- Scenario: `s03-diff-score-blocks`
- Version: `V0`
- Goal: 验证严格 `max_diff_score=1` 时会阻塞
- Entry Command: `开始执行`

## Preconditions
- [x] `.pipeline/config.yaml` 中 `max_diff_score` 为 `1`
- [x] prompt 需求存在明显冲突

## Execution Checks
- [x] Pipeline 能完成步骤执行并生成 review 结论
- [x] `review_code` 给出大于 `1` 的 `diff_score`
- [x] evaluation 根据失败项计算出最终 `diff_score`

## Artifact Checks
- [x] `state.yaml` 中 pipeline 状态变为 `blocked`
- [x] 报告中 Decision 为 `STOP`
- [x] `log.md` 记录阻塞原因

## Exit Criteria
- [x] 当前 prompt 不自动进入下一轮
- [x] 阻塞原因明确指向矛盾需求或架构差异

## Notes
- Status: `PASS`
- Result: `blocked as expected`
- Remarks: 2026-04-22 复跑通过；测试可跑通，但 review/evaluation 明确指出需求冲突导致的架构扭曲，最终以 `diff_score=3` 阻塞。
