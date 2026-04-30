# Hypo-Workflow

> 把复杂 AI 工作拆成可恢复、可审查、可交付的工作流。

## 它解决什么问题

AI Agent 很擅长一次性完成小任务，但在多步骤工程、长上下文协作和跨会话恢复时容易丢失状态、跳过验证或忘记用户约束。Hypo-Workflow 把这些任务组织成清晰的 Pipeline：先规划，再执行，再评估，再继续。

它不是一个后台服务，而是一套 Skill 驱动的工作流规范。Claude Code 和 Codex 都可以直接读取 `SKILL.md`，在本地 `.pipeline/` 中记录状态、报告、日志、Cycle、Patch 和展示物料。

## 核心亮点

- 🔄 **可恢复 Pipeline**：`state.yaml` 记录当前 Prompt、步骤和心跳，中断后可从原位恢复。
- 🧭 **交互式规划**：Plan Discover 强制提问，Decompose 和 Confirm 都有明确门禁。
- 🔁 **Cycle 生命周期**：每个 Cycle 有独立里程碑、归档、摘要和遗留项。
- 🩹 **Patch 旁路修复**：小问题可用 `P001` 轨道记录并直接修复，不必新开 Milestone。
- 📦 **Context Compact**：为 PROGRESS、state、log、reports 和 closed patches 生成紧凑上下文。
- 🧰 **完整命令面**：30 个用户指令覆盖 setup、plan、execute、audit、debug、release、dashboard、showcase 和 rules。
- 🌐 **多平台支持**：Claude Code 使用 `/hypo-workflow:*`，Codex 继续使用 `/hw:*`。
- 🎨 **Showcase 物料**：一条命令生成项目介绍、技术文档、演示 slides 和可选海报。

## 快速上手

1. 安装 Skill 或插件，并运行 `/hw:setup` 配置全局默认值。
2. 在项目中运行 `/hw:init` 生成 `.pipeline/` 基础结构。
3. 用 `/hw:plan` 交互式拆分里程碑，或用 `/hw:init --import-history` 导入旧项目历史。
4. 运行 `/hw:start` 开始执行，之后用 `/hw:resume` 继续。
5. 用 `/hw:status`、`/hw:log`、`/hw:dashboard` 或 `/hw:showcase --all` 查看进展和产出。

## 版本历程

- **V0-V2.5**：建立 TDD Pipeline、状态恢复、Subagent 和 Progressive Disclosure。
- **V3-V5.1**：加入 Claude Hook、Multi-Dim Evaluation、Plan Mode 和 Notion Adapter。
- **V6-V7.1**：扩展生命周期命令、Setup Wizard、Dashboard 和全局配置。
- **V8.0**：加入 Cycle、Patch、Plan Extend、Auto Resume Watchdog 和输出语言/时区。
- **V8.1**：引入 Git History Import，把旧项目导入 Cycle 0 Legacy。
- **V8.2**：加入 Patch Fix、Context Compact 和 Interactive Guide。
- **V8.3**：加入 Showcase preset，并彻底强化 i18n 模板加载。
- **V8.4**：加入 Rules 独立维度，统一管理严格度、生命周期钩子、自定义规则和规则包。

## 适用场景

- 多 Milestone 工程任务，需要中断恢复和持续验证。
- 旧代码库接入 AI 工作流，需要导入历史和生成项目摘要。
- 团队想把 AI Agent 的执行过程变成可审查、可追踪的本地记录。
- 项目完成后需要快速生成介绍文档、技术说明、演示材料和宣传图。
