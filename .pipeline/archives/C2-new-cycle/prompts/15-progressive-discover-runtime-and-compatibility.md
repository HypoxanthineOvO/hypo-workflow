# M16 / F007 — Progressive Discover Runtime and Compatibility

## 实施计划

1. 将 Progressive Discover 结构接入 `/hw:plan` 和 `/hw:plan --batch` 的 interactive 流程。
2. 在 Discover 入口强制先收集任务类别、期望效果、验证方式，再进入更细问题。
3. 让 Agent 在必要时按“假设声明 -> 歧义消解 -> tradeoff -> 验证标准”推进，但允许根据任务复杂度裁剪具体轮次。
4. 轻量复用到 `/hw:plan:extend`：至少先补齐类别、目标和验证，不强制完整四段式。
5. 接入 `@karpathy/guidelines` 规则包扩展点，并保持未启用时的默认行为兼容。

## 依赖

- M15 Progressive Discover 规范
- `skills/plan/SKILL.md`
- `skills/plan-discover/SKILL.md`
- `.opencode/commands/hw-plan*.md`
- `.pipeline/config.yaml`
- `.pipeline/rules.yaml`

## 验证点

- `/hw:plan` 单功能模式仍保持原有主流程，只是问题更结构化。
- `/hw:plan --batch` 能在统一 Discover 中先收集每个 Feature 的类别与验证方式。
- `plan-extend` 不会被过度复杂化。
- 未启用 `@karpathy/guidelines` 时行为兼容当前默认规则集。

## 约束

- 不要把 Discover 写成僵硬问卷；保留 Agent 根据上下文合并问题的能力。
- 不破坏现有最少轮次、确认门、Feature Queue 生成、JIT decomposition 语义。
- 用户输入依然以自然语言为主，后台由 LLM 解释成结构化信息。

## 需求

- 实现 Progressive Discover 运行时接线。
- 更新相关命令文档/提示词。
- 让 batch 规划时可以携带每个 Feature 的类别与验证要求。
- 接入可选 Karpathy 规则包。

## 预期测试

- `/hw:plan` / `--batch` 的交互文档或测试夹具覆盖新的前置问题顺序。
- `plan-extend` 轻量复用路径有明确验证。
- `node --test core/test/*.test.js`

## 预期产出

- Discover runtime 实现或命令模板更新。
- 规则包接线。
- 回归测试与文档更新。
