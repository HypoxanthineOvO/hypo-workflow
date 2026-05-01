# P004: 优化 C2 技术报告 Slides 结构和显示问题
- 严重级: normal
- 状态: closed
- 发现于: C2/M20
- 创建时间: 05-02 00:34
- 修复时间: 05-02 00:47
- 改动: docs/showcase/c2-report/slides.tex — 重构为 51 页命令导向技术报告 Slides；修复封面、章节目录、七段路径、六约束解释、OpenCode 迁移叙事、命令枚举和未来工作
- 测试: ✅ `make slides`、`make report`、`git diff --check` 通过；Slides 51 页，Report 30 页
- 关联: docs/showcase/c2-report/slides.tex, docs/showcase/c2-report/report.tex
- resolved_by: P004
- commit: `8efa19e`
- related: []
- supersedes: []

## 问题

用户反馈 C2 技术报告 Slides 仍存在展示和叙事问题：

1. 封面对半分布局换行不友好，分页丑，`Hypo-Workflow Project Draft` 被截断。
2. “视觉与证据系统”页仍像草稿，应删除。
3. 三张生成图中的第 1、2 张意义不明或不真实，工具迁移应更接近真实图标/界面证据。
4. “个人迁移路径、真实经历、踩到的坑”应按使用路径切分成七页。
5. 不同章节之间缺少目录和当前章节高亮。
6. “六个核心约束”解释不够，读者难以理解。
7. Execution Loop 图中文字太小。
8. OpenCode Adapter 结构图存在重叠。
9. V9 Milestone Timeline 模块太小且意义不大，应改成“为什么想从 Codex 到 OpenCode”；C2 叙事也不清晰。
10. Slides 结构应按命令枚举：介绍每个命令的用法和为什么需要它，然后再进入 Demo Route。
11. 技术报告和 Slides 的未来部分都应加入：探讨 Harness 能否降低对模型工程智力的需求。

## 期望

- 删除草稿页，重构 Slides 主线。
- 修复封面、章节过渡、图中文字/重叠问题。
- 把个人工具迁移路径拆成七页。
- 用更真实的工具/界面证据替代不合理的概念图。
- 增加命令枚举和 Demo Route。
- Report / Slides future work 增补 Harness 对模型工程智力需求的讨论。
