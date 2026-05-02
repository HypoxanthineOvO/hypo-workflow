# M20 / F009 — Book Report Expansion, GPT-Image Slides Refresh, and Showcase Packaging

## 实施计划

1. 重新梳理技术报告主线，把现有“提纲展开稿”升级为真正可正式汇报的长篇技术报告：
   - 前 1/3 重点扩写传记式叙事，按工具与问题演化展开；
   - 后 2/3 贴着主线解释 Hypo-Workflow 如何逐步长出各项机制，而不是把 C2 生硬切成独立专题；
   - 每一部分都明确回答“这个功能解决了怎样的问题”。
2. 引言与前置叙事必须显著扩写，至少覆盖并细写以下经历：
   - Web GPT / Gemini 与 Cherry Studio + DeepSeek 阶段的 repo 不可见与反复喂 prompt；
   - Copilot 阶段，包括 Hypo-LaTeX 里反复粘贴 CHANGELOG / Git 规范 prompt 的低效，以及 Copilot 连续被封 3 个账号后被迫另寻出路；
   - AntiGravity 阶段的自动化幻觉与可控性问题；
   - Claude Code + Bill 阶段的“前期还行、后期 UI/文档失控”；
   - Claude Code + Superpowers + Agent 阶段的早期 Harness 价值、阶段性成功与长期缺乏全局观的问题；
   - Notion AI + Codex 在 Research / Info 阶段把作者逼成“Prompt 搬运工”的经历；
   - Hypo-Workflow 如何作为这些经验的系统化回应逐步成形。
3. 在叙事章节中加入案例插框（case boxes）或等价结构化块，至少为 Hypo-LaTeX、Bill、Agent、Research、Info 这些实名项目保留：
   - 项目名；
   - 当时工具组合；
   - 做成了什么；
   - 暴露了什么问题；
   - 这些问题如何促成下一阶段方法或工具转向。
4. 技术主体按主线展开，而不是单独“讲 C2”。重点细写：
   - `.pipeline/` file-first 协议与状态/恢复语义；
   - Harness Engineering 四条主轴：execution loop、layering、behavior solidification、automatic maintenance；
   - 关键功能随着问题浮现如何被引入，包括 README、Skill 治理、Batch Plan、OpenCode 状态面板、Chat Mode、Progressive Discover、Test Profiles、Showcase；
   - 哪些能力来自用户反馈，哪些是作者主动设计出来的办法。
5. 重做 Slides，不把它当作报告摘要，而是做成独立的技术讲稿：
   - 结构按“问题 -> 经历/崩溃案例 -> 机制 -> 系统 -> 证据 -> 结论”组织，但整体仍与报告主线一致；
   - 页数和信息密度明显增加，不怕多，只怕讲不清；
   - 大量使用真实代码片段、真实 YAML、真实命令、真实 repo 树、真实 `.pipeline` 状态/进度/队列证据。
6. 使用 GPT Image 2 / Image Gen 重做整套视觉系统：
   - 封面、分节页、背景图、叙事图、演化图优先用生成图；
   - 架构图、流程图、示意图也尽量让 GPT Image 2 生成或润色一版；
   - 凡是需要严格映射文件层级、状态机、字段关系的图，保留技术准确表达，必要时与代码生成图混用；
   - 修复现有图片单调、越界、信息密度不足的问题。
7. 在 LaTeX 工程层面做展示物料整顿，但这部分不进入报告主线：
   - 报告源迁移到正式目录，例如 `docs/showcase/c2-report/`；
   - 将 `Hypoxanthine-LaTeX` 依赖整理为仓库根的 submodule：`vendor/Hypoxanthine-LaTeX/`；
   - 清理多余产物、完善 `.gitignore`、稳定构建路径；
   - 报告正文明确采用基于 book 的实现路径，并尽量依赖 `git@github.com:HypoxanthineOvO/Hypoxanthine-LaTeX.git`。

## 依赖

- 现有报告与 slides 源：`.pipeline/showcase/c2-report/`
- C1 / V9 archive：`.pipeline/archives/C1-v9-opencode-native-adapter/`
- C2 全部已完成里程碑、reports、PROGRESS、feature queue、state、design spec
- `Hypoxanthine-LaTeX` 现有 vendor 副本与后续 submodule 目标仓库
- Image Gen（GPT Image 2）生成资产能力

## 验证点

- 报告不再是短稿；引言和叙事章节显著拉长，并包含具体项目/工具经历与例子。
- 报告技术部分不再“提一嘴”，而是把 `.pipeline/`、Harness Engineering 主轴、功能演化与设计判断讲清楚。
- Superpowers 被准确放在“早期 Harness 形态”位置：承认其前期价值，同时明确长期全局观与持续演化不足。
- Slides 不是简单摘要，技术信息密度、证据量、视觉包装都明显提升。
- GPT Image 2 资产形成统一系统，且不牺牲严格技术图的准确性。
- 报告/Slides 源目录、submodule、ignore 与构建路径整理完成后，仓库结构更清晰，可持续维护。

## 约束

- 不要把 Git/submodule/packaging 写成报告主线，它们属于交付包装与展示工程。
- 可以实名写 Hypo-LaTeX、Bill、Agent、Research、Info。
- 文风以技术报告为主，但允许显著穿插第一人称经验；整体口吻为“技术报告中的作者经历”，而不是博客流水账。
- Slides 风格是技术报告风格，有统一包装，但不过度商业化。
- 需要读取用户家目录中的相关上下文时可以只读调查，不得修改 `/home/heyx` 下与当前任务无关的内容。

## 需求

- 扩写并重构技术报告，使其成为长篇、讲透问题链与方法链的正式书稿。
- 重做 Slides 结构、图像与技术证据组织。
- 使用 GPT Image 2 生成/润色封面、背景图、叙事图、流程图、架构图等视觉资产。
- 完成展示物料的 LaTeX/submodule/ignore/目录整理。

## 预期测试

- 报告与 Slides 章节/页数/内容密度检查。
- 关键图像资产存在且被正确引用。
- LaTeX build（report/slides）通过，若环境支持则产出 PDF。
- 相关构建路径、ignore、submodule 配置一致性检查。
- `node --test core/test/*.test.js`
- `git diff --check`

## 预期产出

- 扩写后的技术报告源文件与 PDF。
- 重做后的 Slides 源文件与 PDF。
- GPT Image 2 生成的封面、背景图、叙事图、流程图/架构图资产。
- 更新后的展示目录、submodule、ignore 与构建说明。
- 对本次重构的 Milestone report 与必要的进度/日志更新。
