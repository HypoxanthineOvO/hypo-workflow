# Step: run_tests

## Goal

Run the relevant test suite for the current prompt and classify the result by phase.

## Phase Handling

The pipeline runtime must pass one of these phases into this step:

- `RED`
- `GREEN`
- `GENERAL`

## Instructions

1. Run the most relevant test command for the host project.
2. Record:
   - passed count
   - failed count
   - error count
   - command used
3. Interpret the result by phase:
   - `RED`: newly written tests are expected to fail. If many pass unexpectedly, record a warning.
   - `GREEN`: all required tests are expected to pass. Remaining failures must be reported.
   - `GENERAL`: judge the run by whether the intended suite passes for the current prompt.
4. If `strict=true` for this runtime step and the result does not match expectations, recommend stopping the pipeline.

## Output Notes

Record in state and log:

- phase
- command
- pass/fail/error counts
- warnings
- whether the step should block under strict mode
