# Execution Report: M12 - Evidence Contracts, Metrics, and Real Lifecycle Regression

## Summary
- Prompt: 11-evidence-contracts-metrics-and-real-lifecycle-regression
- Started: 2026-05-04T00:20:00+08:00
- Finished: 2026-05-04T00:49:59+08:00
- Result: pass
- Diff Score: 3/5

## Changes
- Prevented workflow and preset names such as `analysis`, `tdd`, `showcase`, and `implement-only` from becoming Test Profiles.
- Added analysis report/evidence contract helpers so analysis evaluation points to ledger-backed evidence without using `analysis` as a Test Profile.
- Added metrics normalization and rollup helpers with wall-clock duration calculation and explicit `telemetry_unavailable` token/cost markers.
- Added lifecycle regression coverage for stale leases, heartbeat recovery, compact resume, Codex to OpenCode handoff boundaries, reject/accept continuation paths, sync repair, and workflow kind consistency.
- Updated stale regression assertions to the current 37-command docs and OpenCode command contract.

## Tests
- `node --test core/test/*.test.js`: 217/217 passed
- `bash scripts/validate-config.sh .pipeline/config.yaml`: passed
- `python3 tests/run_regression.py`: 62/62 passed
- `git diff --check`: passed

## Evaluation
- tests_pass: pass
- no_regressions: pass
- matches_plan: pass
- code_quality: pass
- Decision: pass

## Notes
- Token/cost telemetry remains unavailable from the host platform, so new metrics records use `telemetry_unavailable`.
- `LICENSE` remains a documented repository metadata gap and is outside this C5 follow-up implementation.

## Next
C5 follow-up implementation is complete and ready for user review.
