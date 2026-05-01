# M8 Report — V9 Regression and Smoke Tests

## Summary

M8 consolidated the V9 static/offline regression suite and verified the full suite at 59/59.

## Changes

- Added `s59-v9-regression-bundle`.
- Verified V9 scenarios `s51` through `s59` are registered.
- Verified V9 smoke tests stay static/offline and do not require OpenCode runtime or network services.
- Updated README validation links/count.

## Verification

- `bash tests/scenarios/v9/s59-v9-regression-bundle/run.sh` — passed
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 59/59
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: test consolidation only
- Codex/Claude compatibility: unchanged
