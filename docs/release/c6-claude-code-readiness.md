# C6 Claude Code Release Readiness

## Automated Evidence

Required commands before release:

```bash
node --test core/test/claude-smoke-readiness.test.js
claude plugin validate .
bash scripts/validate-config.sh .pipeline/config.yaml
node --test core/test/*.test.js
python3 tests/run_regression.py
git diff --check
```

Expected result: all deterministic local validations pass. If `python3 tests/run_regression.py` is unavailable in a checkout, record that environment limitation and run the full Node suite plus plugin validation.

## Manual Claude Code Smoke

Run the manual Claude Code smoke from `docs/platforms/claude-code-smoke.md` in a temporary project. Manual QA must cover plugin validation, `sync --platform claude-code`, `.claude/settings.local.json` merge and backup behavior, `/hw:*` aliases, `/hw:status`, Stop hook blocking, compact resume injection, PermissionRequest profiles, and DeepSeek/Mimo role routing.

## Release Gate

- No marketplace publication in C6 validation.
- No user global Claude settings mutation.
- No provider credentials required for automated tests.
- Published default profile remains `standard`; local developer mode is opt-in.
- Status surface is read-only and secret-safe.
- OpenCode and Codex regressions remain green in the full suite.

## Follow-up Items

- MCP/LSP/Worktree hooks are not required for this release and should be planned separately.
- Marketplace publishing should be a later explicit release step.
- A native persistent Claude status panel can be revisited if Claude Code exposes a validated UI slot beyond monitors.
