---
name: debug
description: Investigate a concrete failure when the user wants symptom-driven root-cause analysis instead of a preventive audit scan.
---

# /hypo-workflow:debug

Use this skill for the five-step debug workflow.

## Preconditions

- a concrete symptom, failing test, trace, or abnormal behavior is available

## Execution Flow

1. Collect symptoms.
2. Gather context:
   - architecture baseline
   - lifecycle log
   - recent milestone report
   - recent git changes
3. Generate 3-5 ranked hypotheses.
4. Validate them in order.
5. Produce a root-cause report and optional fix suggestion.
6. With `--auto-fix`, only claim success after validation passes.
7. Write the report to `.pipeline/debug/` and append a debug lifecycle entry.
8. Set `current.phase=lifecycle_debug` when state tracking is used.

## Reference Files

- `references/debug-spec.md`
- `references/log-spec.md`
- `SKILL.md`
