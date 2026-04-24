# System Test Checklist: s09-subagent-full-delegation

## Metadata
- Scenario: `s09-subagent-full-delegation`
- Version: `V1`
- Goal: 验证 subagent 模式下完整 TDD 流程
- Entry Command: `开始执行`

## Preconditions
- [ ] `.pipeline/config.yaml` 中 `execution.mode=subagent`
- [ ] `review_tests` 和 `review_code` 配置为 subagent
- [ ] prompt 为极简 hello world 场景

## Execution Checks
- [ ] 完整 TDD 6 步走完
- [ ] review 步骤走 subagent 或降级
- [ ] 非 review 步骤仍由主 Agent 执行

## Artifact Checks
- [ ] `state.yaml` 的 `executor` 字段区分 `self` 与 `subagent`
- [ ] 报告中标注哪些步骤由 Subagent 执行
- [ ] `log.md` 记录真实 subagent 调用或 fallback

## Exit Criteria
- [ ] 最终结果为 `PASS`
- [ ] 不因 subagent 路径而破坏 self 步骤顺序

## Notes
- Status: `pending`
- Result: `not run`
