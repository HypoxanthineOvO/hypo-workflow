# M17 / F008 — Test Profile Contracts and Plan Guidance

## 实施计划

1. 引入 Test Profile 概念，定义它是 `preset + verification policy` 的超集，并允许 compose（例如 `webapp + tdd`）。
2. 设计配置表面，建议放在 `config.yaml` 的 `execution.steps` 附近，并保证与现有 Preset 兼容。
3. 在 Plan / Discover 阶段加入强引导：
   - 任务属于哪类场景
   - 希望达到怎样的效果
   - 如何验证成功
   - 若是 research，需要 baseline、方向、脚本
4. 定义三类首批 Profile 合同：
   - `webapp`
   - `agent/service`
   - `research`
5. 整理它们与 `/hw:plan`、`--batch`、Milestone 验收、规则系统的映射关系。

## 依赖

- M15-M16 Progressive Discover
- `references/config-spec.md`
- `config.schema.yaml`
- `references/tdd-spec.md`
- `references/commands-spec.md`
- `references/evaluation-spec.md`

## 验证点

- Profile 与 Preset 兼容，不破坏现有仅用 `tdd` / `implement-only` / `custom` 的项目。
- 三类 Profile 的 Discover 采集项和验收项边界明确。
- `webapp` / `agent-service` / `research` 都在 Plan 阶段明确要求“目标效果 + 验证方式”。
- compose 关系清晰，避免把步骤序列和验证策略混为一谈。

## 约束

- 本 Milestone 先定义合同、配置和 Plan 引导，不一次塞入全部执行实现细节。
- Profile 命名、字段和文案要为多平台 Agent 使用保持清晰。
- 不允许用“只跑单元测试”替代需要真实交互/脚本验证的 Profile。

## 需求

- 新增 Test Profile 规范。
- 新增配置 schema / 文档设计。
- 新增 Plan 阶段的 Profile 采集要求。
- 定义三类 Profile 的合同与 compose 方式。

## 预期测试

- `rg` 检查 `webapp`、`agent/service`、`research` 三类合同均出现。
- 规范中明确写出 Profile 是 Preset 超集且可 compose。
- 配置位置与兼容性策略被明确说明。

## 预期产出

- Test Profile 规范文档。
- 配置/schema 更新草案。
- Plan 引导问题与映射说明。
