# Debug Spec

Use this reference for `/hw:debug`, the symptom-driven debugging workflow.

## Difference From Audit

- `audit` is a preventive broad scan
- `debug` is a symptom-driven root-cause investigation after a failure or abnormal behavior appears

## Five-Step Method

### Step 1: Collect Symptoms

- gather the user-reported error or abnormal behavior
- `--trace` may inspect the latest error logs or failing tests automatically
- collect error text, failing tests, and reproduction steps

### Step 2: Gather Context

- read the architecture baseline
- read `.pipeline/log.yaml`
- read the latest milestone report when available
- inspect `git diff` and `git log --oneline -10`

### Step 3: Generate Hypotheses

- produce 3 to 5 possible root-cause hypotheses
- rank them by likelihood
- record the files or modules involved and a validation method for each

### Step 4: Validate

- validate hypotheses in order through code reading, tests, or targeted instrumentation
- mark each as confirmed, rejected, or needing more information
- if all are rejected, widen the scope and generate a fresh round

### Step 5: Report Root Cause

- explain the confirmed root cause clearly
- provide a concrete fix suggestion, preferably as a diff
- assess impact radius and whether architecture documentation needs an update
- `--auto-fix` may apply the fix only if verification passes
- write the report in `output.language`
- render timestamps in `output.timezone`

## Report Template

```markdown
# Debug-NNN: [symptom title]

> Language: {output_language} | Timezone: {output_timezone}

## Symptom
[user description or error output]

## Context
- Recent changes: [git summary]
- Related modules: [from architecture baseline]

## Hypotheses And Validation
1. [hypothesis 1] — ✅ confirmed / ❌ rejected
   Validation: ...
2. [hypothesis 2] — ...

## Root Cause
[clear explanation]

## Fix Suggestion
[concrete code change]

## Architecture Impact
[whether architecture should be updated]
```

## Safety

- `/hw:debug --auto-fix` must run validation after applying a fix
- if validation fails, keep the diagnosis but do not claim the fix is complete
- always write a report to `.pipeline/debug/` and a `type: debug` entry to `.pipeline/log.yaml`
