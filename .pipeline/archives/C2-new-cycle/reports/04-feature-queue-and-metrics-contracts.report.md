# 执行报告：M05 / F004 — Feature Queue and Metrics Contracts

## 概要

- Prompt：04 — Feature Queue and Metrics Contracts
- 开始时间：2026-05-01T03:27:00+08:00
- 完成时间：2026-05-01T03:46:00+08:00
- 结果：pass
- Diff Score：2/5

## 变更

- 新增 `references/feature-queue-spec.md`，明确 Project、Cycle、Feature、Milestone、Step、Patch、Report 的关系。
- 新增 `references/metrics-spec.md`，定义 Cycle/Feature/Milestone/Step/Patch 的 duration、message、token、cost、updated_at 合同。
- 新增 `.pipeline/feature-queue.yaml` 示例，覆盖 `upfront`、`just_in_time`、`gate: confirm`、`skip_defer` 和 current Feature 指针。
- 新增 `.pipeline/metrics.yaml` 示例，覆盖 `duration_ms`、`token_count: n/a`、`cost: n/a` fallback。
- 增加 `batch.decompose_mode=upfront`、`batch.failure_policy=skip_defer`、`batch.auto_chain=true`、`batch.default_gate=auto` 默认配置、schema 和 config spec。
- 新增 `core/test/feature-queue-metrics.test.js`，把 queue/metrics/config 合同纳入回归。

## 测试结果

- RED 阶段：`node --test core/test/feature-queue-metrics.test.js` 按预期失败，原因是 batch 默认、spec 和 fixtures 尚未实现。
- GREEN 阶段：
  - `node --test core/test/feature-queue-metrics.test.js` — 4/4 passed
  - `node --test core/test/*.test.js` — 27/27 passed
  - YAML parse：feature queue、metrics、project config、config schema、state、log 通过
  - `git diff --check` — M05 范围通过
- 回归问题：无

## 代码审查

- 质量评分：4/5
- 发现的问题：无阻塞问题。
- 架构差异：Feature Queue 只作为调度和摘要层，不替代 `.pipeline/state.yaml`；Metrics 单独承载时长/token/费用明细，不在 queue 中堆细节。
- 已知限制：当前为合同和 fixture，M06/M07 会实现 batch discover、decompose、insert、auto-chain 和 JIT 推进。

## 评估

- tests_pass：pass
- no_regressions：pass
- matches_plan：pass
- code_quality：pass
- 总体 diff_score：2/5
- 决策：继续 M06

## 下一步

执行 M06：实现 `/hw:plan --batch` 的 Discover、Feature Queue 生成和 upfront/JIT decomposition 开关。
