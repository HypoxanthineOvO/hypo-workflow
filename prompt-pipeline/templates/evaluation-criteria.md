# Evaluation Criteria

Apply only the checks enabled in `evaluation.checks`.

## Checks

### tests_pass
Pass when the GREEN phase finishes with all relevant tests passing.
Fail when any required test still fails or errors.

### no_regressions
Pass when tests that were passing before the current prompt still pass after implementation.
Fail when previously passing behavior regresses.

### matches_plan
Pass when the implemented files, interfaces, and observable behavior are broadly consistent with the prompt's `预期产出`.
Fail when the output is materially incomplete, in the wrong place, or structurally different without justification.

### code_quality
Pass when the review conclusion is acceptable and the code review score is at least `3/5`.
Fail when readability, structure, naming, or obvious defects lower the review score below `3/5`.

## Diff Score Formula

- Base score = `1`
- Each failed check adds `1`
- Final score = `min(1 + failed_checks, 5)`

## Decision Rule

- If `diff_score <= evaluation.max_diff_score`, the prompt may continue.
- If `diff_score > evaluation.max_diff_score`, stop the pipeline and report the blocking checks.
