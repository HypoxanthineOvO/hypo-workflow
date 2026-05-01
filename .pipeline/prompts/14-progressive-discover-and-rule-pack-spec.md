# M15 / F007 — Progressive Discover and Karpathy Guidelines Spec

## 实施计划

1. 为 Discover 阶段定义递进式询问骨架，而不是仅允许自由问答若干轮。
2. 先定义大问题优先的入口顺序：
   - 任务属于哪一类（例如 webapp / agent-service / research / other）
   - 希望达到什么效果
   - 怎么验证成功
3. 在此基础上整理建议性递进结构：
   - 假设声明
   - 歧义消解
   - tradeoff 呈现
   - 验证标准确认
4. 将 Karpathy 四准则整理为可选规则包 `@karpathy/guidelines`，并说明与现有 V8.4 Rules 的关系。
5. 明确本结构优先作用于 `/hw:plan` 与 `/hw:plan --batch`，`/hw:plan:extend` 只轻量复用。

## 依赖

- `skills/plan/SKILL.md`
- `skills/plan-discover/SKILL.md`
- `skills/plan-extend/SKILL.md`
- `references/commands-spec.md`
- `.pipeline/rules.yaml`

## 验证点

- 递进式 Discover 不破坏现有 interactive `min_rounds` 与 explicit confirm 语义。
- 大问题优先顺序与 Test Profile 的分类/验证采集需求一致。
- `@karpathy/guidelines` 明确为可选 extends，不默认启用。
- 结构是“强模板 + 允许裁剪”，不是僵硬固定四轮脚本。

## 约束

- 本 Milestone 先做交互结构和规则包合同，不直接把所有运行时都写完。
- 不把 Karpathy 规则包写成默认强制规则。
- 需要保留用户自然语言输入和 Agent 二次理解空间。

## 需求

- 新增 Progressive Discover 设计规范。
- 新增大问题优先询问顺序。
- 新增 `@karpathy/guidelines` 规则包定义。
- 说明 `/hw:plan`、`--batch`、`plan-extend` 的覆盖边界。

## 预期测试

- 规范中明确包含任务类别、目标效果、验证方式三个前置问题。
- `rg` 检查假设/歧义/tradeoff/验证标准四段与可选规则包说明均已出现。
- 明确写出 `plan-extend` 为轻量复用而非完整强绑。

## 预期产出

- Progressive Discover 规范文档。
- `@karpathy/guidelines` 规则包说明。
- 交互骨架示例或流程草图。
