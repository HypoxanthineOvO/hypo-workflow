# M7 Report — OpenCode Full V8.4 Parity

## Summary

M7 added OpenCode parity smoke coverage and route-specific command guidance for V8.4 user-facing capabilities.

## Changes

- Added `references/opencode-parity.md`.
- Linked V8.4 parity from `references/opencode-spec.md`.
- Added command-specific guidance for Patch Fix, Release, Compact, Showcase, and Dashboard.
- Added `s58-opencode-full-v84-parity` regression coverage.
- Updated README regression count to 58/58.

## Verification

- `bash tests/scenarios/v9/s58-opencode-full-v84-parity/run.sh` — passed
- `node --test core/test/*.test.js` — passed, 8/8
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 58/58
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: OpenCode command parity and documentation
- Codex/Claude compatibility: unchanged
