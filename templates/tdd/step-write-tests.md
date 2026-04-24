# Step: write_tests

## Goal

Read the current prompt's `预期测试` section and write the tests needed for this prompt.

## Instructions

1. Read the current prompt file and focus on `预期测试`.
2. Infer the minimal set of test files needed by the host project.
3. Cover:
   - normal paths
   - boundary cases
   - error handling
4. Write or extend test files.
5. Do not implement production code in this step.
6. If the prompt does not provide enough test intent, stop and report the missing detail.

## Output Notes

Record in state and log:

- test files created or modified
- approximate number of test cases added
- any uncovered risk you intentionally deferred
