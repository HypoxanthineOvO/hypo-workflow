# M07 / F001 - Full Regression and Cross-Platform Smoke Readiness

## Objective

Run full validation for C7, verify generated adapters and automation behavior, and produce the final report.

## 需求

- Validate every C7 surface:
  - automation policy
  - subagent discipline
  - Codex continuation and preflight
  - init non-git behavior and automation levels
  - Cursor/Copilot/Trae adapters
  - Chinese README onboarding
- Update release/readiness docs if the project uses them for final checks.
- Produce the final C7 milestone report with evidence and residual risks.
- Include an explicit quality synthesis pass:
  - verify implementation and validation were separated where practical
  - verify Codex Subagent guidance does not claim external model routing
  - verify lightweight proposer/challenger behavior is represented in docs/specs
  - verify any milestone that did not use Subagents records why

## Boundaries

- In scope:
  - focused tests introduced in M01-M06
  - full Node suite
  - Python regression suite
  - config validation
  - generated adapter validation
  - README freshness
  - docs consistency
- Do not tag, push, publish, or perform external release actions without explicit confirmation.
- Do not accept "tests pass" alone as final evidence if docs/adapters/README freshness checks are missing.

## Implementation Plan

1. Ask a review Subagent to inspect the final diff and identify missing validation areas, if available.
2. Run all focused C7 tests.
3. Run full Node test suite.
4. Run Python regression scenarios.
5. Run config validation.
6. Validate generated adapter files and README freshness.
7. Run `git diff --check`.
8. Run the quality synthesis pass for Subagent use, testing/implementation separation, and proposer/challenger coverage.
9. Fix any regressions in scope.
10. Write final report and update `PROGRESS.md`.

## 预期测试

- All focused C7 tests pass.
- Full Node suite passes.
- Python regression scenarios pass.
- Config validation passes.
- README freshness passes.
- Generated adapter checks pass.
- `git diff --check` passes.
- Final report includes Subagent usage/non-usage evidence and test/implementation separation evidence.

## Validation Commands

- `node --test core/test/*.test.js`
- `python3 tests/run_regression.py`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `git diff --check`

## Evidence

- Include command outputs with pass counts.
- Include list of generated platform adapter files.
- Include README freshness result.
- Include known limitations, especially around Codex hook capability and Trae rule semantics.
- Include quality synthesis findings, including any deferred C8 debate-framework follow-up.

## 预期产出

- Final C7 readiness report.
- Updated `.pipeline/PROGRESS.md`.
- `.pipeline/reports/06-full-regression-and-cross-platform-smoke-readiness.report.md`
