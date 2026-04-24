# TDD Step Spec

Use this reference when the active pipeline step belongs to the TDD preset. The main skill only decides step order and state transitions; this file defines what each step should actually do.

## Sequence Map

`tdd` expands to:

1. `write_tests`
2. `review_tests`
3. `run_tests_red`
4. `implement`
5. `run_tests_green`
6. `review_code`

`implement-only` expands to:

1. `implement`
2. `run_tests`
3. `review_code`

## Shared TDD Rules

- Work only on the current prompt.
- Use the current prompt file as the authoritative source for `需求`, `预期测试`, and `预期产出`.
- Prefer the smallest correct change set.
- Preserve existing project conventions unless the prompt explicitly requires a structural change.
- When evidence is missing, stop and record a blocking reason instead of guessing.

## write_tests

Goal: translate `预期测试` into concrete automated checks.

Design principles:

- Cover the happy path first.
- Add edge cases for empty values, invalid input, and missing resources where relevant.
- Include error-handling tests when the prompt implies failure behavior.
- Keep the tests close to observable behavior; do not overfit to internals.
- Do not add production implementation in this step.

Expected notes:

- files created or modified
- approximate new test count
- deferred coverage risks, if any

## review_tests

Goal: verify that the new or updated tests are worth implementing against.

Checklist:

- Does the suite cover every named expectation from `预期测试`?
- Are there boundary cases for empty, missing, or invalid inputs?
- Are test names readable and scoped to one behavior each?
- Are there redundant or brittle tests that should be simplified?

Outcome guidance:

- `pass`: coverage is sufficient and naming is clear
- `needs_changes`: small gaps exist and can be fixed immediately
- `critical`: the tests are misleading or fundamentally incomplete

## run_tests_red

Goal: confirm that the newly written tests fail before implementation.

Expected behavior:

- Newly introduced tests should fail for the right reason.
- Existing unrelated tests may still pass.
- A fully green run is suspicious unless the target behavior already exists.

Record at minimum:

- command used
- pass/fail/error counts
- whether the failure mode matches the prompt

## implement

Goal: make the intended tests pass with the smallest reasonable implementation.

Implementation rules:

- Follow the project architecture already in the repository.
- Avoid changing tests unless you can point to a test bug.
- Keep interfaces simple and consistent with the prompt.
- Prefer explicit behavior over clever abstractions.
- If the prompt conflicts with reality, document the compromise in notes.

## run_tests_green

Goal: verify that the prompt is complete and non-regressive.

Passing standard:

- The intended suite for the current prompt is green.
- Previously passing tests remain green.
- When `write_tests` was skipped through cascade logic, this step can degrade to inline validation and must record `fallback=inline_validation, reason=tests_skipped`.

Record at minimum:

- command or fallback mode used
- pass/fail/error counts
- regressions, if any

## run_tests

Use this step for `implement-only` or custom flows that include a generic test gate.

If no test files exist for the current prompt:

- run inline validation instead
- verify imports succeed
- verify there are no syntax errors
- note `inline_validation` in state and log

## review_code

Goal: assess final code quality and prompt alignment.

Review checklist:

- readability
- naming clarity
- structural complexity
- obvious bugs or unsafe behavior
- fit versus `预期产出`
- architecture drift versus what the prompt asked for

This step produces both:

- `code_quality`
- `diff_score`

The main skill consumes those values when computing the final decision.
