# M03 / F002 — Skill Asset Audit and Quality Spec

## 实施计划

1. 枚举所有本地 Skill：根 `SKILL.md`、`skills/*/SKILL.md`、用户 home 中相关 Hypo-Workflow skill 副本。
2. 对照 `core/src/commands/index.js`、`.opencode/commands/*`、`.opencode/agents/*`、`references/opencode-command-map.md` 建立 command-to-skill 映射表。
3. 复核已调研的外部规范：Oh My OpenAgent、SuperSkills/agentskill.sh、Anthropic skill-development、SkillsLLM、SkillsBench。
4. 创建 `references/skill-spec.md`，定义 frontmatter、description、Output Language Rules、Preconditions、Execution Flow、Interactive Behavior、Reference Files、平台映射、保护文件提示等结构。
5. 记录当前问题，不在本 Milestone 删除、合并或重命名 Skill。

## 依赖

- `skills/*/SKILL.md`
- `SKILL.md`
- `core/src/commands/index.js`
- `references/opencode-command-map.md`
- 外部调研结论已经记录在 `.pipeline/design-spec.md`

## 验证点

- 30 个用户命令和 29 个用户 Skill 的映射关系可查。
- `watchdog` 内部 Skill 的例外被明确说明。
- `references/skill-spec.md` 给出可执行的格式规范，而不是泛泛建议。

## 约束

- C2 不合并或删除 Skill。
- 不改变 Skill trigger 语义。
- 不根据外部项目盲目引入新目录结构，先适配本仓库。

## 需求

- 审计现有所有 Skill 资产。
- 建立统一的 Skill 命名、目录、文档格式、平台映射规范。
- 记录当前过时、冗余、结构不统一、引用缺失或命名不清的问题。
- 以 `references/skill-spec.md` 固化质量标准，为 M04 自动检查提供依据。

## 预期测试

- 使用 `rg --files` 和 command map 交叉检查 Skill 资产数量和映射。
- 检查 `references/skill-spec.md` 中示例路径存在或明确标记为示例。
- 运行现有 command/artifact 测试，确认审计文档没有影响生成逻辑。

## 预期产出

- `references/skill-spec.md`
- Skill 资产清单和问题清单。
- 更新 `.pipeline/design-spec.md` 或相关 reference 中的 Skill 体系说明。
