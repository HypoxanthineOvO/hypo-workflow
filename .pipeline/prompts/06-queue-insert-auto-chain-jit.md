# M07 / F004 — Queue Insert, Auto-Chain, and JIT Milestones

## 实施计划

1. 读取 M05/M06 产物，确定 queue mutation 和 auto-chain 的状态字段。
2. 定义 `/hw:plan --insert` 自然语言操作：append、insert、reprioritize、pause、replace/adjust description。
3. 加确认 gate：任何队列变更先总结 diff，再等待用户确认。
4. 实现 auto-chain 策略：Feature 验收通过后自动推进下一项；`gate: confirm` 暂停；失败按 `skip_defer` 默认策略处理。
5. 实现 `just_in_time` 模式语义：轮到 Feature 时再拆 Milestone，拆完直接进入执行/验收。
6. 记录 Feature/Milestone duration/token/cost summary；不可用时显示 `n/a`。

## 依赖

- M05 queue/metrics schema。
- M06 batch plan flow。
- `skills/start/SKILL.md`
- `skills/resume/SKILL.md`
- `skills/plan/SKILL.md`
- `skills/plan-decompose/SKILL.md`
- `references/state-contract.md`

## 验证点

- 自然语言队列编辑不会静默写入，必须有确认。
- `gate: confirm` 能阻止 auto-chain 继续。
- `skip_defer` 会保留失败 Feature 的记录和后续恢复入口。
- JIT 模式不影响 upfront 默认模式。

## 约束

- 自然语言理解可以先作为 Agent command semantics，不强行写复杂 parser；但队列写入必须结构化、可审计。
- 不把 Feature Queue 当作 runner；实际工作仍由 Agent 执行 Milestone prompt。
- 不推断 token/cost。

## 需求

- 添加 `/hw:plan --insert` 语义和文档。
- 支持 batch auto-chain。
- 支持 `gate: confirm`。
- 支持 `just_in_time` Milestone decomposition。
- 支持 queue/metrics summary 更新。

## 预期测试

- Queue edit fixtures：append、insert before/after、reprioritize、pause、replace/adjust。
- Auto-chain fixtures：success advance、gate confirm stop、failure skip_defer。
- Metrics fallback fixture：token/cost unavailable => `n/a`。
- `node --test core/test/*.test.js`

## 预期产出

- 更新后的 plan/start/resume docs 或 helpers。
- Queue mutation semantics。
- Metrics update docs/helpers。
- Tests/fixtures。
