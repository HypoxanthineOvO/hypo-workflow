# 执行报告：M09 / F003 — OpenCode Sidebar and Footer Panels

## 概要

- Prompt：08 — OpenCode Sidebar and Footer Panels
- 开始时间：2026-05-01T13:08:00+08:00
- 完成时间：2026-05-01T13:25:33+08:00
- 结果：pass
- Diff Score：2/5

## 变更

- 新增 `plugins/opencode/templates/plugin-tui.tsx`，为 OpenCode 1.14.30 TUI Slot API 注册 `sidebar_content`、`sidebar_footer`、`home_footer`、`session_prompt_right`。
- 扩展 `core/src/artifacts/opencode.js`，生成独立 server plugin、TUI plugin，以及 colocated runtime status module。
- 新增 `.opencode/runtime/hypo-workflow-status.js` 生成策略，避免 TUI plugin 依赖 Hypo-Workflow 仓库源码路径。
- 更新 `plugins/opencode/templates/package.json`，补齐 `@opencode-ai/plugin` 和 `solid-js` 依赖。
- 更新 `core/test/opencode-panels.test.js` 与 `core/test/commands-rules-artifacts.test.js`，覆盖独立 TUI plugin、runtime module、legacy cleanup、root/adapter config 分工。
- 更新 `references/opencode-spec.md` 与 `references/v9-architecture.md`，记录 root `opencode.json` 挂 plugin、`.opencode/opencode.json` 不重复声明 plugin，以及 helper module 不进入 `.opencode/plugins/`。

## 测试结果

- RED 阶段：`node --test core/test/opencode-panels.test.js` 按预期失败，原因是 `renderOpenCodeStatusTuiPlugin` 尚未导出。
- GREEN 阶段：
  - `node --test core/test/opencode-panels.test.js` — 3/3 passed
  - `node --test core/test/commands-rules-artifacts.test.js` — 3/3 passed
  - `node --test core/test/*.test.js` — 45/45 passed
  - `git diff --check` — 通过
- OpenCode smoke：
  - `opencode --version` — `1.14.30`
  - `opencode debug config` 验证了 `sidebar_content` / `sidebar_footer` 所在 TUI plugin 与 server plugin 均被解析
  - 修复了两个实际配置问题：
    - `.opencode/opencode.json` 重复声明 plugin 导致 `.opencode/.opencode/...` 嵌套路径
    - 旧版 `plugins/hypo-workflow-status.js` 会被 OpenCode 当作第三个本地 plugin 自动发现

## 代码审查

- 质量评分：4/5
- 发现的问题：无阻塞问题。
- 架构差异：M09 保持 UI read-only，不修改 `.pipeline/` 状态，不回退 server plugin 的 fileGuard / commandMap / auto-continue 语义。
- 稳健性：
  - TUI plugin 仅消费 M08 只读状态模型；
  - warnings 通过 toast 提示；
  - helper module 改为放在 `.opencode/runtime/`，避免被 OpenCode 误判为本地 plugin。

## 评估

- tests_pass：pass
- no_regressions：pass
- matches_plan：pass
- code_quality：pass
- 总体 diff_score：2/5
- 决策：F003 完成；因下一 Feature `F005` 配置 `gate: confirm`，auto-chain 在进入 M10 前暂停。

## 下一步

等待确认进入 F005：

- M10：Technical Report Outline, Evidence, and Assets Plan
- M11：Full Technical Report
- M12：Beamer Slides, Demo Script, and Cycle Validation
