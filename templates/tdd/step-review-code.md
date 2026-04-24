# Step: review_code

## Goal

Review the implementation after tests are green and assess how closely it matches the prompt's intended output.

## Instructions

1. Inspect the changed production code and any justified test changes.
2. Check:
   - readability
   - naming
   - structure
   - unnecessary complexity
   - obvious bugs
   - obvious security issues
3. Compare the actual output with the prompt's `预期产出`.
4. Summarize architectural differences, if any.

## Diff Score

Choose one score:

- `1`: fully aligned with the expected output
- `2`: minor acceptable differences
- `3`: noticeable but reasonable differences
- `4`: large differences that need discussion
- `5`: severe deviation and should stop

## Output Notes

Record in state and log:

- review summary
- issues found
- architecture diff description
- `diff_score`
