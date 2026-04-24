# System Test Checklist: s08-subagent-self-review

## Metadata
- Scenario: `s08-subagent-self-review`
- Version: `V1`
- Goal: 验证 review 步骤的 subagent 委托与 fallback
- Entry Command: `开始执行`

## Preconditions
- [ ] `.pipeline/config.yaml` 中 `execution.mode=subagent`
- [ ] `execution.subagent_tool=auto`
- [ ] `review_tests` 和 `review_code` 均配置 `reviewer=subagent`

## Execution Checks
- [ ] Agent 识别了 `execution.mode=subagent`
- [ ] `review_tests` 步骤尝试调用 Subagent
- [ ] `review_code` 步骤尝试调用 Subagent
- [ ] 如果 Subagent 不可用，自动降级为 self

## Artifact Checks
- [ ] `state.yaml` 中 `review_tests` / `review_code` 的 `executor` 字段正确
- [ ] 如果发生 fallback，`log.md` 记录了 `subagent_fallback=true` 和 `reason`
- [ ] Pipeline 不因 Subagent 不可用而阻塞

## Exit Criteria
- [ ] 最终结果为 `PASS`
- [ ] 降级后 self 执行仍保持正常

## Notes
- Status: `pending`
- Result: `not run`
