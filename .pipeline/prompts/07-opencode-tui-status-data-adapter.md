# M08 / F003 — OpenCode TUI Status Data Adapter

## 实施计划

1. 读取 OpenCode adapter 当前实现：`plugins/opencode/templates/plugin.ts`、`.opencode/plugins/hypo-workflow.ts`、`core/src/artifacts/opencode.js`。
2. 设计只读状态模型，聚合 cycle、state、PROGRESS/log、feature queue、metrics、reports、patches。
3. 实现数据适配 helper：缺文件时返回默认值，YAML/Markdown 解析失败时降级显示错误摘要。
4. 计算 sidebar/footer 所需字段：Cycle、Feature Queue、current Feature、Milestones、recent events、progress、score、heartbeat、gate/failure、duration/tokens/cost。
5. 添加 fixture 测试：empty、active、failed、gated、completed、metrics unavailable。

## 依赖

- M05 queue/metrics schema。
- `core/src/config/index.js` YAML parser 或现有依赖。
- `.pipeline/state.yaml`
- `.pipeline/cycle.yaml`
- `.pipeline/log.yaml`
- `.pipeline/patches/*`
- `plugins/opencode/templates/plugin.ts`

## 验证点

- Adapter 不写 `.pipeline/` protected files。
- 缺少 `feature-queue.yaml` 或 `metrics.yaml` 时 UI 仍能显示基础状态。
- token/cost 不可用时显示 `n/a`。
- latest evaluation score 能从 report 或 metrics 中 best-effort 提取。

## 约束

- 本 Milestone 只做数据层，不注册 TUI slot。
- 不能把 Hypo-Workflow 变成 runner。
- 解析逻辑要保守，失败时显示问题而不是抛出导致 UI 崩溃。

## 需求

- 实现 OpenCode TUI 状态数据适配层。
- 状态来源必须是 `.pipeline/` 文件。
- 输出模型能同时支持 sidebar 和 footer。
- 支持 recent 10 events、duration/token/cost summary、latest score、gate/failure。

## 预期测试

- Fixture tests 覆盖 empty/active/failed/gated/completed。
- Metrics unavailable => `n/a`。
- Malformed optional file 不导致整体失败。
- `node --test core/test/*.test.js`

## 预期产出

- OpenCode status model/helper。
- Fixtures/tests。
- 更新 `references/opencode-spec.md` 或相关 TUI status spec。
