# M10 / F005 — Technical Report Outline, Evidence, and Assets Plan

## 实施计划

1. 建立报告目录和文件结构，建议放在 `docs/report/` 或 `.pipeline/showcase/` 的 C2 专用目录。
2. 按已确认章节创建中文技术报告骨架：
   - Experience and motivation
   - Constraints in AI-assisted coding
   - Harness Engineering
   - Hypo-Workflow architecture
   - Core mechanisms
   - V9 OpenCode Native Adapter case study
   - C2 new design, including Chat Mode / Progressive Discover / Test Profiles
   - Live demo route
   - Limitations and future work
3. 收集 V9 Case Study evidence：C1 archive prompts/reports/summary、OpenCode adapter files、tests、references、logs。
4. 收集 C2 extension evidence：`/hw:chat`、递进式 Discover、Test Profile 合同/实现、Feature Queue 调整、状态面板扩展后的运行状态。
5. 起草工具对比表：Web GPT/Gemini、Cherry Studio + DeepSeek、Copilot、AntiGravity、Claude Code、Skills/Superpowers、Notion AI Opus + Codex、Hypo-Workflow。
6. 规划图表：执行闭环、层级关系、`.pipeline/` file protocol、OpenCode adapter、Feature Queue、TUI panel、Chat lifecycle、Progressive Discover、Test Profile matrix、demo route。
7. 规划 GPT Image 生成的非技术插图，仅用于辅助展示；技术主图优先使用 Mermaid / TikZ / Graphviz。

## 依赖

- C1 archive: `.pipeline/archives/C1-v9-opencode-native-adapter/`
- C2 extension artifacts from M13-M19
- `.pipeline/design-spec.md`
- `.pipeline/architecture.md`
- `references/v9-architecture.md`
- `plugins/opencode/templates/plugin.ts`
- `core/test/*.test.js`

## 验证点

- 每个事实性技术 claim 都有来源文件，或明确标记为个人经验。
- 图表清单能映射到报告章节和 slides topic blocks。
- V9 Case Study 覆盖 planning、milestones、command/adapter mapping、tests、patches、release/archive、context persistence。
- C2 新增特性覆盖 Chat Mode、递进式 Discover、Test Profiles 三条设计线，并与 F005 的最终展示叙事对齐。

## 约束

- 不先写 Beamer；先完成技术报告骨架和证据。
- 图片不能替代准确技术图。
- 报告中文为主，保留 English technical terms。

## 需求

- 创建报告骨架和证据清单。
- 形成图表/图片资产计划。
- 起草工具对比表。
- 形成 demo route 草案：`/hw:plan` or `/hw:plan --batch` -> Test Profile & Progressive Discover -> Feature Queue -> `/hw:chat` / OpenCode status panel -> `/hw:release` README update。

## 预期测试

- Evidence inventory 中的本地路径存在。
- 报告骨架包含所有确认章节。
- 对比表包含确认维度：repository visibility、planning ability、context persistence、recoverability、style/behavior solidification、automatic maintenance、validation loop。
- 图表计划包含新增三组需求的专属图或对比块。

## 预期产出

- 技术报告 source skeleton。
- V9 Case Study evidence inventory。
- C2 extension evidence inventory。
- Diagram/image asset plan。
- Comparison table draft。
- Demo route draft。
