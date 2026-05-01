# M1 Report — Core Shared Config and Artifact Kernel

## Summary

M1 added the first shared V9 `core/` helper layer. It is a deterministic setup/artifact utility, not a pipeline runner.

## Changes

- Added `core/package.json`, `core/bin/hw-core`, and module exports under `core/src/`.
- Implemented config load/write/merge helpers with a small dependency-free YAML parser.
- Implemented profile normalization and platform capability lookup.
- Implemented the canonical 30-command OpenCode command map.
- Implemented rules summary generation compatible with existing `scripts/rules-summary.sh`.
- Implemented OpenCode command, agent, and config artifact rendering.
- Added `s52-core-config-artifacts` regression coverage and Node unit tests.
- Updated README and V9 architecture references for the actual core entry point.

## Verification

- `node --test core/test/*.test.js` — passed, 8/8
- `bash tests/scenarios/v9/s52-core-config-artifacts/run.sh` — passed
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 52/52
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: helper-only; no pipeline runner introduced
- Codex/Claude compatibility: unchanged
