# M06 / F004 — Batch Plan Discover and Upfront Decomposition

## 实施计划

1. 基于 M05 schema 更新 `skills/plan/SKILL.md`、`skills/plan-discover/SKILL.md`、`skills/plan-decompose/SKILL.md`、`plan/PLAN-SKILL.md`。
2. 定义 `/hw:plan --batch`：Discover 一次覆盖多个 Feature，统一提问、确认后生成 Feature Queue。
3. 支持默认 `upfront` decompose：一开始为所有 Feature 生成 Milestone 拆分和 Feature 级架构/依赖图。
4. 明确 `just_in_time` 模式只在轮到 Feature 时拆 Milestone。
5. 生成 Markdown 表格和 Mermaid 图，展示 Feature Queue、依赖、架构影响。
6. 保留普通 `/hw:plan` 的交互和 P1-P4 gating 不变。

## 依赖

- M05 Feature Queue/Metrics contracts。
- `skills/plan*/SKILL.md`
- `.opencode/commands/hw-plan*.md`
- `core/src/commands/index.js`
- `references/commands-spec.md`

## 验证点

- `/hw:plan` 无 flag 时行为描述不变。
- `/hw:plan --batch` 文档明确多 Feature Discover、统一确认、队列生成。
- `upfront` 默认行为包含所有 Feature 的初始 Milestone 拆解。
- Mermaid/Markdown 输出位置和命名明确。

## 约束

- P1 interactive hard gate 仍然生效。
- 不能让 batch 自动跳过用户确认，除非 plan.mode=auto 且配置允许。
- 不在本 Milestone 实现 `/hw:plan --insert`。

## 需求

- 增加 batch planning 模式文档和命令语义。
- 生成 `.pipeline/feature-queue.yaml` 的规划逻辑或模板。
- 支持 `batch.decompose_mode=upfront` 默认。
- 支持 Feature-level tables 和 Mermaid diagrams。
- 确认单功能 `/hw:plan` 完全不变。

## 预期测试

- 命令/文档测试：`/hw:plan`、`/hw:plan --batch` 路由和说明正确。
- Batch fixture 生成 Feature Queue 和 upfront decompose 计划。
- Markdown/Mermaid artifacts 可读且被引用。
- `node --test core/test/*.test.js`

## 预期产出

- 更新后的 plan Skill/spec/command 文档。
- Batch queue generation 模板或 helper。
- Tests/fixtures。
- Feature Queue 示例输出。
