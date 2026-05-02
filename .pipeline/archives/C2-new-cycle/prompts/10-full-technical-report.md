# M11 / F005 — Full Technical Report

## 实施计划

1. 基于 M10 骨架写完整中文技术报告，目标 20-30 页，保留 English technical terms。
2. 第一部分使用个人 AI 工具经验引入：Web GPT/Gemini、Cherry Studio + DeepSeek、Copilot、AntiGravity、Claude Code、Skills/Superpowers、Notion AI Opus + Codex。
3. 第二部分抽象 AI-assisted coding 约束：context management、manual prompt feeding、self-deception risk、style persistence、iteration drift、interruption/recovery。
4. 第三部分定义 Harness Engineering，并展开 Hypo-Workflow 的四个机制轴：execution loop、layering、behavior solidification、automatic maintenance。
5. 第四部分写架构细节：`.pipeline/` file protocol、Cycle/Feature/Milestone/Patch、Skills/rules/hooks、reports/evaluation/release gates、multi-platform adapters。
6. 第五部分详细写 V9 OpenCode Native Adapter case study，用真实文件/命令/schema/测试/归档记录支撑。
7. 第六部分详细写 C2 新设计：README 自动更新、Skill 体系整理、OpenCode 状态面板、Batch Planning、Chat Mode、Progressive Discover、Test Profiles。
8. 第七部分写 future work：纯分析辅助、非代码 workflow、observability metrics、cross-platform adapters。
8. 编译 PDF；若工具链缺失，记录 blocker 并保证 source 可审阅。

## 依赖

- M10 report skeleton/evidence。
- 当前实现文件和 C1 archive。
- LaTeX 工具链或项目可用文档构建工具。
- GPT Image 资产仅作为可选补充。

## 验证点

- 报告包含所有确认章节。
- 个人经验与技术论证分层清晰。
- 对 Copilot/AntiGravity 的批评转化为具体技术限制，同时保留用户表达风格。
- V9 Case Study 不是抽象描述，而是展示真实细节。
- C2 新增三组需求不仅有动机，还要有合同、流程、实现边界和验证机制。
- 报告能编译或给出明确 blocker。

## 约束

- 不虚构不存在的实现能力。
- 不引用无法追溯的技术事实。
- 不把 slides 内容提前作为主产物；slides 从报告派生。

## 需求

- 写完整技术报告。
- 内容目标：
  - 动机与个人经验；
  - AI Coding 约束；
  - Harness Engineering；
  - Hypo-Workflow 架构；
  - 核心机制；
  - V9 Case Study；
  - C2 设计（含 Chat Mode / Progressive Discover / Test Profiles）；
  - Demo；
  - 局限与未来工作。
- 生成 PDF 或记录编译阻塞。

## 预期测试

- LaTeX/report build。
- `rg` 检查必需章节标题。
- 检查本地文件引用路径存在。
- 技术 claim 与当前 repo state 一致。
- 报告覆盖新增三组需求的图表、流程或接口说明。

## 预期产出

- 技术报告 source。
- 编译后的 report PDF，如果环境支持。
- Diagram assets。
- Build notes 或 blocker notes。
