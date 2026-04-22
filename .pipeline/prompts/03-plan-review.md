# Prompt 03: Plan Review

## 需求

实现 Plan Review 与架构追踪：

- 增加 `references/plan-review-spec.md`
- 实现 `/hw:review` 与 `/hw:review --full`
- 在主 `SKILL.md` 的 Pipeline 流程中加入 Plan Review
- 明确 `architecture.md` 的变更记录格式

## 预期测试

- Milestone 完成后可触发 Plan Review
- `architecture.md` 记录 ADDED / CHANGED / REASON / IMPACT
- 检测后续 prompt 受影响时会给出修改建议
- `/hw:review --full` 会回顾全部 Milestone

## 预期产出

- `references/plan-review-spec.md`
- `SKILL.md`
- `plan/PLAN-SKILL.md`
