# M19 / F008 — Research Test Profile Runtime and Baseline Validation

## 实施计划

1. 实现 `research` Profile 的 Discover 强制采集：
   - baseline 指标是什么
   - 预期变化方向是什么
   - 实际跑的脚本是什么
   - 是否还有数据、随机种子、环境等关键约束
2. 将上述信息落到可追踪的结构化产物中，供后续验证与报告复用。
3. 在验证阶段要求真实执行脚本，对比修改前后指标变化，而不是只看代码 diff。
4. 让 report / evaluation 能明确记录 baseline、after、delta、结论和 blocker。
5. 补充回归测试，确保 `research` Profile 与其他 Profile 以及旧 Preset 兼容。

## 依赖

- M17 Test Profile 合同
- M15-M16 Progressive Discover
- `references/evaluation-spec.md`
- `.pipeline/reports/`
- 现有 metrics / report helper

## 验证点

- `research` Profile 在 Plan 阶段强制把目标效果与验证方式说清楚。
- 验证阶段真实执行脚本并生成前后对比结果。
- 不允许仅基于 diff 或单元测试给出通过结论。
- 报告能回溯 baseline、脚本和结果方向。

## 约束

- 不虚构 benchmark 结果；拿不到脚本或 baseline 时必须明确阻塞。
- 尽量复用现有 metrics/report 结构，而不是另造一套完全独立输出。
- 与 `webapp` / `agent/service` Profile 共享统一 Profile 接口。

## 需求

- 实现 `research` Profile runtime。
- 实现 baseline/script/delta 记录与报告。
- 接入验证与评估路径。

## 预期测试

- research Profile 的 Discover 采集测试。
- baseline / after / delta 结果记录测试。
- 验证阶段必须执行脚本的约束测试。
- `node --test core/test/*.test.js`

## 预期产出

- research Profile runtime 实现代码。
- 指标对比报告接线。
- 回归测试与说明文档。
