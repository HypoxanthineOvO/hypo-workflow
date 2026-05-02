# P005: OpenCode 界面显示当前模型和 Subagent 子模型
- 严重级: normal
- 状态: closed
- 发现于: C3/Patch
- 创建时间: 05-02 15:51
- 修复时间: 05-02 15:51
- 改动: core/src/opencode-status/index.js, plugins/opencode/templates/plugin-tui.tsx — 在 OpenCode TUI 状态模型中显示当前 agent/model、最新 active subagent/model，并列出配置的 subagent model matrix
- 测试: ✅ `node --test core/test/*.test.js`、OpenCode sync smoke、`opencode run --agent hw-build` 通过
- 关联: core/test/opencode-status.test.js, core/test/opencode-panels.test.js, references/opencode-spec.md
- resolved_by: P005
- commit: `0fc5ac4`
- related: []
- supersedes: []

## 问题

OpenCode UI 只能看到 Hypo-Workflow pipeline 状态，看不到当前 session 实际使用的模型，也看不到最新调用的 subagent 子模型，排查 model matrix 和 agent frontmatter 时需要手动翻文件或日志。

## 期望

- TUI sidebar 显示 `Current` 当前 agent/model。
- TUI sidebar 显示最新 `Active subagent` agent/model。
- TUI sidebar 列出配置的 subagent model matrix。
- Footer 显示当前模型和 subagent 模型的短标签。
