# M07 Report - Claude Manual Smoke and Release Readiness

## 摘要

M07 已完成 C6 Claude Code adapter 的 manual smoke 与 release-readiness 收口：新增 deterministic 临时项目 smoke fixture、人工 Claude Code QA 清单、release readiness 文档，并修正旧 regression 场景中仍期待 37 个 OpenCode 命令和 `hw-dashboard` 的历史口径，使其与当前 36-command contract 保持一致。

## Step 状态

| Step | 状态 | 证据 |
|---|---|---|
| write_tests | done | 新增 `core/test/claude-smoke-readiness.test.js` |
| review_tests | done | 覆盖 plugin validate、sync、settings backup、aliases/status、hooks、profiles、DeepSeek/Mimo routing、manual QA |
| run_tests_red | done | 初始失败：smoke docs 和 `scripts/claude-smoke-fixture.mjs` 不存在 |
| implement | done | 实现 smoke fixture、manual checklist、release readiness doc，并同步旧 regression 36-command 口径 |
| run_tests_green | done | M07 focused tests、deterministic smoke、plugin/config/full Node/Python regression/diff check 全部通过 |
| review_code | done | Smoke fixture 不触碰全局 Claude settings；manual docs 明确 live Claude Code 仍需用户验证 |

## 新增测试与资产

- `core/test/claude-smoke-readiness.test.js`
  - 检查 manual smoke checklist 覆盖所有 M07 required actions
  - 执行 deterministic fixture 并验证 settings backup、hooks、status、PermissionRequest profiles、DeepSeek/Mimo routing
- `scripts/claude-smoke-fixture.mjs`
  - 创建临时 project
  - 运行 `runProjectSync(... platform: "claude-code")`
  - 验证 `.claude/settings.local.json` merge/backup
  - 验证 Stop/compact/PermissionRequest hook behavior
  - 验证 status surface 与 model routing
- `docs/platforms/claude-code-smoke.md`
- `docs/release/c6-claude-code-readiness.md`

## RED

命令：

```bash
node --test core/test/claude-smoke-readiness.test.js
```

结果：失败符合预期，原因是 smoke checklist docs 和 fixture script 尚未存在。

## GREEN

命令：

```bash
node --test core/test/claude-smoke-readiness.test.js
node scripts/claude-smoke-fixture.mjs
claude plugin validate .
bash scripts/validate-config.sh .pipeline/config.yaml
node --test core/test/*.test.js
python3 tests/run_regression.py
git diff --check
```

结果：

- `core/test/claude-smoke-readiness.test.js`: 2/2 passed
- deterministic smoke fixture: `ok=true`, global settings not mutated, backup created, hooks/status/profile/model routing checks passed
- `claude plugin validate .`: passed
- `bash scripts/validate-config.sh .pipeline/config.yaml`: passed
- `core/test/*.test.js`: 250/250 passed
- `python3 tests/run_regression.py`: 62/62 passed
- `git diff --check`: passed

## Smoke Evidence

Deterministic fixture confirmed:

```json
{
  "global_settings_mutated": false,
  "settings": { "plugin_namespace": "hw", "has_hooks": true, "backup_created": true },
  "hooks": { "stop_blocked": true, "compact_resume": true },
  "permissions": {
    "developer": "allow",
    "standard_destructive": "ask",
    "strict_pipeline_write": "deny"
  },
  "models": {
    "docs": "deepseek-v4-pro",
    "code": "mimo-v2.5-pro",
    "test": "mimo-v2.5-pro"
  }
}
```

Post-report live smoke fix: user testing in `/tmp/hw-claude-live-zNqc11` exposed that settings referenced `node hooks/claude-hook.mjs` but sync did not write a project-local wrapper. The fix adds `claude_code_hooks` sync output and generates `hooks/claude-hook.mjs` with a managed marker and absolute `file://` import to the installed core. Verified commands:

```bash
node --test core/test/claude-settings-sync.test.js core/test/claude-smoke-readiness.test.js core/test/claude-hooks.test.js
node scripts/claude-smoke-fixture.mjs
claude plugin validate .
git diff --check
```

The user's temporary project was re-synced and `node hooks/claude-hook.mjs SessionStart startup` returned valid resume context from that project.

Second live smoke fix: user testing showed `/hw:plan` still resolved toward the old `/hypo-workflow` surface. Root cause was a Claude Code namespace mismatch: plugin skills/commands are exposed under the plugin name, and `.claude/settings.local.json` plugin-path injection does not load a development plugin. The fix changes the Claude plugin namespace to `hw`, treats existing workflow skills as the `/hw:*` entries, removes managed settings plugin injection, and documents `claude --plugin-dir <Hypo-Workflow repo>` for local smoke. Verified commands:

```bash
node --test core/test/claude-settings-sync.test.js core/test/claude-smoke-readiness.test.js core/test/claude-plugin-alias.test.js core/test/claude-hooks.test.js
node scripts/claude-smoke-fixture.mjs
claude plugin validate .
git diff --check
```

Manual QA path:

- Follow `docs/platforms/claude-code-smoke.md` in a fresh temporary project.
- Confirm `/hw:status` compact output and `/hw:*` alias delegation in live Claude Code.
- Confirm live hook/monitor behavior in Claude Code; deterministic local tests validate the hook policy core and wrapper output, but they cannot replace user-side UI verification.

## 产出

- Claude adapter plugin package artifacts and aliases
- safe `.claude/settings.local.json` merge and backup support
- Claude hook runtime and permission profiles
- Claude subagent model routing with DeepSeek/Mimo defaults
- Claude status surface with monitor fallback
- deterministic smoke fixture and manual QA docs
- final release-readiness checklist

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

C6 自动化部分已完成，Cycle 进入 `pending_acceptance`。下一步需要用户在 Claude Code 中按 `docs/platforms/claude-code-smoke.md` 手动跑临时项目 smoke，并根据结果 `/hw:accept` 或 `/hw:reject`。
