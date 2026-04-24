# System Test Checklist: s17-plan-review

## Metadata
- Scenario: `s17-plan-review`
- Version: `V5`
- Goal: 验证 Plan Review 与 `/hw:review`

## Execution Checks
- [ ] `references/plan-review-spec.md` 存在
- [ ] `/hw:review` 已注册
- [ ] `/hw:review --full` 已注册
- [ ] `SKILL.md` 流程包含 Plan Review 步骤

## Artifact Checks
- [ ] `architecture.md` 使用 `ADDED / CHANGED / REASON / IMPACT`
- [ ] review 会提示后续 prompt 影响
