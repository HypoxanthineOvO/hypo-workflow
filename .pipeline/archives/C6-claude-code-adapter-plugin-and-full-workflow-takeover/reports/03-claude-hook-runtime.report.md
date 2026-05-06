# M04 Report - Claude Hook Runtime

## 摘要

M04 已完成 Claude Code hook runtime：新增 shared `core/src/claude-hooks/` policy helper、`hooks/claude-hook.mjs` Node wrapper，并把 M03 的 settings merge 改为注册统一 hook wrapper。覆盖事件包括 `SessionStart`、`Stop`、`PreCompact`、`PostCompact`、`PostToolUse`、`PostToolBatch`、`UserPromptSubmit`、`PermissionRequest`、`FileChanged(.pipeline/PROGRESS.md)`。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 `core/test/claude-hooks.test.js` |
| review_tests | done | 覆盖 event contracts、Stop gate、compact resume、permission profiles、progress refresh |
| run_tests_red | done | 初始失败：`evaluateClaudeHookEvent` 未导出 |
| implement | done | 实现 hook core、Node wrapper、settings hook registration 和 docs |
| run_tests_green | done | Hook 聚焦测试、旧 hook 回归、settings sync、完整 core suite 和 diff check 通过 |
| review_code | done | Hook wrapper 薄，policy 可测试；OpenCode/legacy shell hook 回归未受影响 |

## 新增测试

- `core/test/claude-hooks.test.js`
  - `SessionStart` 和 compact hooks 注入 resume-oriented context
  - `Stop` 阻断缺失关键证据，metrics gap 仅 warning
  - `PermissionRequest` 遵循 `developer` / `standard` / `strict`
  - tool/batch/file hooks 输出 Progress refresh payload
  - generated settings 注册全部初始 Claude events
  - `hooks/claude-hook.mjs` stdout 是可解析 JSON

## RED

命令：

```bash
node --test core/test/claude-hooks.test.js
```

结果：失败符合预期，原因是 `evaluateClaudeHookEvent` 尚未导出。

## GREEN

命令：

```bash
node --test core/test/claude-hooks.test.js core/test/knowledge-hooks.test.js core/test/opencode-hooks.test.js
bash -n hooks/*.sh
node --test core/test/claude-settings-sync.test.js
node --test core/test/*.test.js
git diff --check
```

结果：

- Claude/Knowledge/OpenCode hook tests: 13/13 passed
- `bash -n hooks/*.sh`: passed
- `core/test/claude-settings-sync.test.js`: 5/5 passed
- `core/test/*.test.js`: 236/236 passed
- `git diff --check`: passed

## 证据样例

Stop blocker:

```json
{"decision":"block","reason":"Workflow-critical evidence is missing: .pipeline/PROGRESS.md. Update the files before stopping."}
```

Compact resume packet includes Cycle, current prompt, current step, next action, required files, automation state, recent events, and the instruction not to replay completed steps.

Permission decisions:

- `developer`: protected workflow file write -> `allow`
- `standard`: destructive command -> `ask`
- `strict`: protected workflow file write -> `deny`

## 产出

- `core/src/claude-hooks/index.js`
- `hooks/claude-hook.mjs`
- `renderClaudeCodeSettingsHooks(config)`
- `evaluateClaudeHookEvent(event, payload, options)`
- Settings registration now points to `node hooks/claude-hook.mjs <EventName>`
- Docs:
  - `hooks/README.md`
  - `references/platform-claude.md`
  - `docs/platforms/claude-code.md`

## 评估

| Check | 结果 |
|---|---|
| tests_pass | pass |
| no_regressions | pass |
| matches_plan | pass |
| code_quality | pass |

- `diff_score`: 1
- `code_quality`: 4
- `test_coverage`: 1
- `complexity`: 2
- `architecture_drift`: 1
- `overall`: 2

## 后续

继续 M05：生成 Claude agents/subagents，并把模型选择从 shared model pool 与 `claude_code.agents` override 接入，支持声明优先和动态选择提示。
