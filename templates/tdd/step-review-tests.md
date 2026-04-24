# Step: review_tests

## Goal

Review the tests written for the current prompt before implementation starts.

## Instructions

1. Inspect the tests added in `write_tests`.
2. Check whether coverage is sufficient for:
   - happy path behavior
   - edge cases
   - invalid input or failure handling
3. Check whether test names and structure are clear.
4. If gaps exist, fix the tests now.
5. Do not add production implementation unless a test cannot be expressed otherwise.

## Review Verdict

Produce one verdict:

- `通过`
- `需修改`
- `严重问题`

## Output Notes

Record in state and log:

- verdict
- gaps found
- test files changed during review
