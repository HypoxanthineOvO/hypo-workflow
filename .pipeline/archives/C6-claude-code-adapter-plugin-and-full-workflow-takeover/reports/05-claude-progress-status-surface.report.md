# M06 Report - Claude Progress Status Surface

## 摘要

M06 已完成 Claude Code Progress-style status surface：新增 Progress 表格解析、Claude status surface helper、plugin monitor artifact、`/hw:status` alias guidance，并把 Claude hook refresh 输出接到同一套紧凑状态模型。状态面只读，展示 milestone/progress table、current phase/next action、automation/profile basics 和 recent events，不直接暴露 raw logs 或 secrets。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 `core/test/claude-status-surface.test.js` 和 `core/test/progress-table.test.js` |
| review_tests | done | 覆盖 milestone rows、automation/profile、recent events、redaction、monitor fallback、hook refresh |
| run_tests_red | done | 初始失败：Claude status/progress parser helpers 未导出 |
| implement | done | 实现 Progress parser、Claude status surface、plugin monitor artifact、hook refresh snapshot 和 docs |
| run_tests_green | done | 聚焦测试、相关 Claude/OpenCode 回归、完整 core suite、plugin validate 和 diff check 通过 |
| review_code | done | 状态面保持 read-only；monitor 明确为 notification/fallback；hook payload secret-safe |

## 新增测试

- `core/test/progress-table.test.js`
  - 从 `.pipeline/PROGRESS.md` 解析 metadata、当前状态、基本设置、milestone table、时间线
  - 对 token/API key 风格内容做 redaction
- `core/test/claude-status-surface.test.js`
  - Claude status surface 渲染 Progress sections、automation basics、safety profile
  - Markdown 输出复用 compact shared model
  - monitor manifest 包含 `ProgressMonitor`
  - `FileChanged(.pipeline/PROGRESS.md)` hook refresh 附带 `claude_status` snapshot

## RED

命令：

```bash
node --test core/test/claude-status-surface.test.js
node --test core/test/progress-table.test.js
```

结果：失败符合预期，原因是 `buildClaudeStatusSurface` 与 `parseProgressTables` 等新 API 尚未导出。

## GREEN

命令：

```bash
node --test core/test/claude-status-surface.test.js core/test/progress-table.test.js core/test/opencode-status.test.js
node --test core/test/claude-plugin-alias.test.js core/test/claude-hooks.test.js core/test/claude-settings-sync.test.js
node --test core/test/*.test.js
claude plugin validate .
git diff --check
```

结果：

- Claude status/progress/OpenCode status focused tests: 16/16 passed
- Claude plugin/hook/settings focused regressions: 14/14 passed
- `core/test/*.test.js`: 248/248 passed
- `claude plugin validate .`: passed
- `git diff --check`: passed

## 证据样例

Compact status output:

```md
- Progress: 5/7
- Current: M06 review_code
- Phase: executing
- Next: continue_execution
- Automation: evaluation.auto_continue=true, batch.auto_chain=true
- Safety: standard
- Monitor: fallback-required
```

Hook refresh sample includes:

```json
{
  "claude_status": {
    "summary": "M06 | review_code | 5/7 | next:continue_execution",
    "progress": { "completed": 5, "total": 7, "percent": 71 },
    "safety_profile": "standard"
  }
}
```

Monitor capability finding: Claude Code plugin monitor packaging is available, but C6 does not assume a validated persistent native status panel. The shipped path is notification/fallback first: monitor notification -> `/hw:status` compact output -> SessionStart/Stop summary -> dashboard guidance.

## 产出

- `core/src/progress/index.js`
  - `parseProgressTables(source, options)`
- `core/src/claude-status/index.js`
  - `buildClaudeStatusSurface(projectRoot, options)`
  - `renderClaudeStatusMarkdown(surface)`
  - `renderClaudeStatusMonitorManifest(options)`
- `core/src/claude-hooks/index.js`
  - `ProgressMonitor`
  - `claude_status` snapshots on progress refresh events
- Plugin artifacts:
  - `.claude-plugin/plugin.json` with `monitors`
  - `monitors/monitors.json`
  - `skills/hw-status/SKILL.md` status surface guidance
- Docs:
  - `docs/platforms/claude-code.md`
  - `references/platform-claude.md`
  - `references/config-spec.md`
  - `skills/status/SKILL.md`

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

继续 M07：在临时项目中做 Claude Code smoke/readiness 验证，重点检查 DeepSeek docs、Mimo code/test、plugin install/sync、hook/status fallback，以及人工验证方案。
