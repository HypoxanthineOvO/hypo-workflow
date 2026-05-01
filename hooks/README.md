# Pipeline Hooks

Hooks 为 Hypo-Workflow Pipeline 提供被动安全网。

## 平台支持

| Hook | Claude Code | Codex |
|------|-------------|-------|
| Stop 强制完成 | ✅ decision:block | ❌ 不支持 |
| SessionStart 上下文注入 | ✅ additionalContext | ❌ 不支持 |
| InstructionsLoaded 监听 | ✅ 可选 | ❌ 不支持 |
| 完成通知 | ✅ Notification | ✅ notify |

## Chat Recovery

M13 起，Hook 规范额外支持 `/hw:chat` 的追加对话语义：

- SessionStart 可在无 active Milestone 时提示用户可以进入 `/hw:chat`
- SessionStart 可在 `chat.active == true` 时恢复 chat context
- 恢复时优先注入 `state.yaml + cycle.yaml + PROGRESS.md + recent report`
- Stop Hook 可根据会话规模决定写 `chat summary`，或只保留 `chat_entry` 与修改痕迹
- 当 chat 修改不再轻量时，Hook / runtime 可提示升级为 Patch escalation

## 安装

### 方式 1：Plugin 安装（推荐，Claude Code）

如果通过 Plugin 安装了 hypo-workflow，Hook 已自动配置。

### 方式 2：手动安装

详见：

- Claude Code: `references/platform-claude.md`
- Codex: `references/platform-codex.md`

## 验证

```bash
# 测试 stop-check（非 Pipeline 目录，应输出空 JSON）
echo '{}' | bash hooks/stop-check.sh

# 测试 session-start（非 Pipeline 目录，应输出空 JSON）
echo '{}' | bash hooks/session-start.sh startup
```
