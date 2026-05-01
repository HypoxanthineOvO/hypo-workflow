# Progressive Discover Spec

Use this reference when planning needs stronger structure than “ask a few rounds and hope for the best”.

## Big Questions First

Progressive Discover starts from three big questions before deeper drilling:

1. task category
2. desired effect
3. verification method

The Agent should ask these early for both ordinary `/hw:plan` and `/hw:plan --batch`. This keeps later Milestone decomposition tied to the right task class and test surface.

## Progressive Stages

After the big questions, the default full structure is:

1. assumption statement
2. ambiguity resolution
3. tradeoff review
4. validation criteria

This is a strong template, not a rigid questionnaire. The Agent may merge related prompts in one round, but it should not skip the structure entirely.

## Batch Discover

Batch Discover still runs one unified interview, but every Feature candidate should capture:

- task category
- desired effect
- verification method
- gate preference
- decompose mode
- acceptance boundary

Feature Queue previews should carry category and verification metadata so later Test Profiles can reuse them.

## Plan Extend Coverage

`/hw:plan:extend` uses lightweight Progressive Discover:

- keep big questions first
- confirm category, desired effect, and verification method
- reuse assumption statement and validation criteria
- do not force the full four-stage interview when the change is clearly incremental

## Karpathy Guidelines Rule Pack

`@karpathy/guidelines` is an optional rule pack. It is not default enabled.

The pack contains:

- `karpathy-think-before-coding`
- `karpathy-simplicity-first`
- `karpathy-surgical-changes`
- `karpathy-goal-driven-execution`

When enabled, these rules act as always-on planning and implementation guidance rather than hardcoded control flow.

## Runtime Notes

- keep natural-language user input as the source; structured fields are extracted after the conversation
- preserve existing `interaction_depth`, `min_rounds`, and explicit Discover completion semantics
- do not replace normal `/hw:plan`; make it more disciplined
