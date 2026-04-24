# Pipeline Hooks

Hooks 为 Hypo-Workflow Pipeline 提供被动安全网。

## 平台支持

| Hook | Claude Code | Codex |
|------|-------------|-------|
| Stop 强制完成 | ✅ decision:block | ❌ 不支持 |
| SessionStart 上下文注入 | ✅ additionalContext | ❌ 不支持 |
| InstructionsLoaded 监听 | ✅ 可选 | ❌ 不支持 |
| 完成通知 | ✅ Notification | ✅ notify |

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
