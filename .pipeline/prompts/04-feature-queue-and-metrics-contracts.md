# M05 / F004 — Feature Queue and Metrics Contracts

## 实施计划

1. 阅读计划相关 Skill、state/log/progress/release specs 和当前 config schema。
2. 明确定义 Project、Cycle、Feature、Milestone、Patch、Step、Report 的关系。
3. 创建 Feature Queue schema：队列项、优先级、状态、gate、decompose mode、current pointer、failure policy、metric summary。
4. 创建 Metrics schema：Cycle/Feature/Milestone/Step 维度的 duration、tokens、cost、message_count、updated_at。
5. 增加配置默认设计：`batch.decompose_mode=upfront`、`batch.failure_policy=skip_defer`，并更新 schema/default/docs。
6. 添加可解析 fixtures，为 M06/M07 做输入。

## 依赖

- `skills/plan/SKILL.md`
- `skills/plan-decompose/SKILL.md`
- `skills/plan-generate/SKILL.md`
- `references/state-contract.md`
- `references/progress-spec.md`
- `references/log-spec.md`
- `config.schema.yaml`
- `core/src/config/index.js`

## 验证点

- `.pipeline/feature-queue.yaml` 与 `.pipeline/metrics.yaml` 的职责分离清楚：queue 存摘要，metrics 存细节。
- `upfront` 和 `just_in_time` 都有示例。
- `gate: confirm`、`skip_defer`、token/cost `n/a` fallback 被覆盖。

## 约束

- 不改现有单功能 `/hw:plan` 流程。
- 不把 Feature Queue 混进 `.pipeline/state.yaml` 的核心执行状态。
- 不根据模型价格推断成本，只使用 SDK/平台提供的 cost。

## 需求

- 创建 `references/feature-queue-spec.md` 和 `references/metrics-spec.md`，或等价清晰 reference。
- 定义 `.pipeline/feature-queue.yaml`、`.pipeline/metrics.yaml` schema 和示例。
- 更新 config defaults/schema/docs。
- 明确 Feature/Cycle/Milestone/Patch 关系。

## 预期测试

- YAML fixture 解析测试。
- config default/merge 测试覆盖 batch 默认值。
- docs examples 包含 upfront/JIT、gate confirm、skip defer、metrics fallback。
- `node --test core/test/*.test.js`

## 预期产出

- Feature Queue spec。
- Metrics spec。
- Config/schema/default 更新。
- Queue/metrics 示例 fixtures。
