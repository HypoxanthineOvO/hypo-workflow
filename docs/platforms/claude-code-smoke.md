# Claude Code Smoke 检查清单

这份清单用于在临时项目里手动 QA Claude Code 适配。它不会发布 marketplace，不需要 provider 凭证，也不应该修改用户全局 Claude settings。

## 本地确定性 Smoke

在 Hypo-Workflow 仓库根目录运行：

```bash
node scripts/claude-smoke-fixture.mjs
claude plugin validate .
hypo-workflow sync --platform claude-code
```

预期结果：

- `sync --platform claude-code` 会写入 Claude plugin manifest、settings、hooks、agents 和 status monitor artifacts。
- `.claude/settings.local.json` 会保留已有用户配置。
- `.claude/settings.local.json` 会写入主会话模型 `model=deepseek-v4-pro`，除非发现用户自有 model 冲突并要求手动确认。
- 如果配置了 `claude_code.api`，`.claude/settings.local.json.env` 会写入项目级 `ANTHROPIC_BASE_URL` / `ANTHROPIC_API_KEY`，覆盖全局 Claude Code API 设置；已有用户自有 env 冲突会阻止静默覆盖。
- 修改已有 settings 前，会生成 `.claude/settings.local.json.bak.YYYYMMDDHHMMSS` 备份。
- `.claude/agents/hw-docs.md` 使用 `deepseek-v4-pro`。
- `.claude/agents/hw-code.md` 和 `.claude/agents/hw-test.md` 使用 `mimo-v2.5-pro`。
- `monitors/monitors.json` 包含 `ProgressMonitor` fallback。

## 手动 Claude Code QA

创建一个全新的临时项目，然后在该项目里本地引用 Hypo-Workflow plugin。

1. 在 Hypo-Workflow 仓库里运行 `claude plugin validate .`。
2. 在临时项目里运行 `hypo-workflow sync --platform claude-code`。
3. 检查 `.claude/settings.local.json`，确认 `model: "deepseek-v4-pro"` 和 hook groups 存在，并且已有用户 settings 被保留。
4. 再运行一次 sync，确认内容不变时不会重复创建 backup。
5. 用开发版 plugin 启动 Claude Code：`claude --plugin-dir <Hypo-Workflow 仓库绝对路径>`。
6. 输入 `/hw:status`，确认它展示紧凑 milestone 表格、当前 phase/next action、自动化/profile 基本设置和最近事件。
7. 输入一个 `/hw:*` 入口，例如 `/hw:plan` 或 `/hw:resume`，确认它进入现有 Hypo-Workflow Skill，而不是重新实现 workflow。
8. 删除或临时移走 `.pipeline/PROGRESS.md` 后触发 Stop hook；Stop hook 应该阻止停止，并明确指出缺少 `.pipeline/PROGRESS.md`。
9. 触发 compact resume；注入上下文应该要求从 `.pipeline/state.yaml` 继续，并提醒不要重放已完成步骤。
   - 手动在终端测试 hook 时要给它 stdin 并关闭输入，例如：`printf '{}' | node hooks/claude-hook.mjs SessionStart startup`。
   - 不要直接运行 `node hooks/claude-hook.mjs SessionStart startup` 后等待；交互终端不会自动发送 EOF，它会一直等输入。
10. 检查 PermissionRequest profile 行为：
   - `developer`：本地自动化可以继续。
   - `standard`：破坏性命令和外部副作用需要确认。
   - `strict`：受保护 workflow 文件写入会被拒绝。
11. 确认模型路由：
   - docs role -> `deepseek-v4-pro`
   - code role -> `mimo-v2.5-pro`
   - test role -> `mimo-v2.5-pro`
12. 如需全量替换 API，先确认 DeepSeek 网关兼容 Anthropic Messages API，然后在临时项目 `.pipeline/config.yaml` 写入：

```yaml
claude_code:
  model: deepseek-v4-pro
  api:
    base_url_env: DEEPSEEK_ANTHROPIC_BASE_URL
    api_key_env: DEEPSEEK_API_KEY
```

运行 `DEEPSEEK_ANTHROPIC_BASE_URL=... DEEPSEEK_API_KEY=... hypo-workflow sync --platform claude-code` 后，检查 `.claude/settings.local.json.env` 是否包含 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY`。不要把真实 key 写入 smoke 文档或报告。

发布前，把手动 QA 结果记录到 M07 report 或 release checklist。

## 限制

- 真实 Claude Code hook 和 monitor UI 行为必须由用户在 Claude Code 里确认。
- Monitor 目前按 notification/fallback 处理，不假设一定有持久原生面板。
- 本地 smoke 使用 `--plugin-dir` 加载开发版 plugin；持久安装需要单独走 `claude plugin marketplace add` / `claude plugin install`。
- 这个 smoke 不包含 marketplace 发布。
