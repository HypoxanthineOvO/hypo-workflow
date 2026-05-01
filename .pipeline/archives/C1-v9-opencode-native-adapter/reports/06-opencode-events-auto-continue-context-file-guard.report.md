# M6 Report — OpenCode Events, Auto Continue, Context Restore, and File Guard

## Summary

M6 expanded the OpenCode plugin scaffold with explicit event policies for command context, safe auto-continue, compact context restoration, file guard behavior, and permission logging.

## Changes

- Added `auto_continue.enabled/mode` profile output with safe default.
- Added plugin scaffold functions for `recordCommandContext`, `fileGuard`, `shouldAutoContinue`, `restoreCompactContext`, and `recordPermissionEvent`.
- Added `permission.replied` handling.
- Added compact context references for state, PROGRESS, cycle, rules, and patches.
- Added file guard deny/warn contract for protected and ordinary `.pipeline` writes.
- Added `s57-opencode-events-auto-continue-file-guard` regression coverage.

## Verification

- `bash tests/scenarios/v9/s57-opencode-events-auto-continue-file-guard/run.sh` — passed
- `node --test core/test/*.test.js` — passed, 8/8
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 57/57
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: plugin policy scaffold, no autonomous business execution
- Codex/Claude compatibility: unchanged
