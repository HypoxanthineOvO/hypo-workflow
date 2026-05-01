# M2 Report — Global CLI/TUI Setup

## Summary

M2 added the setup-only `hypo-workflow` global CLI. It manages global config, profiles, doctor checks, adapter sync, install hints, and project initialization while explicitly avoiding pipeline execution.

## Changes

- Added `cli/bin/hypo-workflow`.
- Added `cli/README.md`.
- Implemented setup, doctor, sync, profile list/use/edit, install, and init-project commands.
- Added non-interactive flags for CI/no-TTY use.
- Wired OpenCode sync/init-project to the V9 core artifact generator.
- Added `s53-global-cli-tui-setup` regression coverage.
- Updated README and V9 architecture references.

## Verification

- `bash tests/scenarios/v9/s53-global-cli-tui-setup/run.sh` — passed
- `node --test core/test/*.test.js` — passed, 8/8
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 53/53
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: setup utility only; no runner behavior added
- Codex/Claude compatibility: unchanged
