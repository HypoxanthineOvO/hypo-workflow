# M0 Report — V9 Architecture and OpenCode Capability Matrix

## Summary

M0 established the V9 OpenCode native adapter baseline without implementing plugin code. The milestone added testable references for OpenCode capability mapping, cross-platform support boundaries, and the V9 architecture shape.

## Changes

- Added `references/opencode-spec.md` with official OpenCode doc anchors, native/plugin-assisted/agent-prompt/HW-specific classification, and all 30 command mappings.
- Added `references/platform-capabilities.md` covering Codex, Claude Code, and OpenCode with an explicit No degradation commitment.
- Added `references/v9-architecture.md` defining `core/`, `plugins/opencode/`, the setup-only `hypo-workflow` CLI, and non-runner execution flow.
- Added regression scenario `s51-opencode-capability-matrix`.
- Updated README with the V9 OpenCode Native Adapter planning section and regression count.

## Verification

- `bash tests/scenarios/v9/s51-opencode-capability-matrix/run.sh` — passed
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 51/51
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: contained to docs/specs/tests as required by M0
- Codex/Claude compatibility: unchanged
