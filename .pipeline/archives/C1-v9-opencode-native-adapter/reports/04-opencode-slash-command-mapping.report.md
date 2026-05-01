# M4 Report — OpenCode Slash Command Mapping

## Summary

M4 strengthened the full OpenCode slash-command mapping so each generated command includes its canonical HW command, agent binding, skill path, and runtime context expectations.

## Changes

- Extended command metadata with corresponding `skills/*/SKILL.md` paths.
- Updated OpenCode command rendering with canonical command, route, skill, and context loading guidance.
- Added `references/opencode-command-map.md` with the full 30-command mapping.
- Added `s55-opencode-command-map` regression coverage.

## Verification

- `bash tests/scenarios/v9/s55-opencode-command-map/run.sh` — passed
- `node --test core/test/*.test.js` — passed, 8/8
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 55/55
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: command generation and docs only
- Codex/Claude compatibility: unchanged
