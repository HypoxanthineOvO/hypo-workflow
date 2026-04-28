# Unified Log Spec

Use this reference for the V6 lifecycle ledger at `.pipeline/log.yaml`.

## Goal

`log.yaml` is the durable, queryable activity ledger for milestone delivery and post-plan lifecycle work. It complements the legacy step trace in `log.md` instead of replacing it outright.

## File Location

- canonical path: `.pipeline/log.yaml`
- optional report directories created on demand:
  - `.pipeline/fixes/`
  - `.pipeline/audits/`
  - `.pipeline/debug/`

## Schema

```yaml
entries:
  - id: "M0"
    type: milestone | fix | audit | debug | plan_review | release | cycle | patch | watchdog
    ref: "milestone-m0"
    status: completed | warning | blocked | failed | proposed
    timestamp: "2026-04-24T10:00:00Z"
    summary: "Added unified logging foundation."
    report: ".pipeline/fixes/fix-001.md"
    trigger: plan_review | audit | debug | user | regression | auto
    related_milestone: "M0"
```

Field rules:

- `id`: stable entry id such as `M0`, `FIX-003`, `AUDIT-002`
- `type`: one of `milestone`, `fix`, `audit`, `debug`, `plan_review`, `release`, `cycle`, `patch`, `watchdog`
- `ref`: human-readable pointer to a prompt, command, report, release tag, or issue
- `status`: lifecycle result for the entry
- `timestamp`: ISO-8601 timestamp
- `summary`: one-line activity summary
- `report`: optional path to a detailed markdown report
- `trigger`: one of `plan_review`, `audit`, `debug`, `user`, `regression`, `auto`
- `related_milestone`: nearest owning milestone such as `M4`; optional for pure release work

## Write Triggers

Write a new entry when:

- a milestone closes
- a fix report is written
- an audit report is written
- a debug investigation finishes
- a plan review produces architecture delta notes
- a release is prepared or published
- a Cycle opens, closes, archives, pauses, or is abandoned
- a Patch opens, closes, or is resolved by a milestone
- watchdog retries are exhausted or automatic resume succeeds

## Read Behavior

`/hw:log` should format entries as:

- default: newest 10 entries
- `--all`: all entries
- `--type <type>`: filter by `type`
- `--since <milestone>`: show entries whose `related_milestone` is that milestone or later

If `log.yaml` does not exist, respond with `暂无日志，执行 Pipeline 后自动生成`.

When displaying entries, use `output.language` and convert timestamps to `output.timezone`.

## Fix Report Template

```markdown
# Fix-NNN: [title]

## Metadata
- Trigger: [user / regression / audit / debug]
- Related Milestone: [Mx]
- Status: [completed / warning / failed]

## Problem
- [symptom or failing behavior]

## Root Cause
- [why it happened]

## Fix
- [what changed]

## Verification
- [tests / checks / evidence]

## Architecture Impact
- [none / what changed in architecture]
```

## Audit Report Template

```markdown
# Audit Report — YYYY-MM-DD

## Metadata
- Scope: [full project / dir]
- Focus: [all / security / bugs / arch / perf / tests / quality]
- Trigger: [audit / user / regression]

## Findings
- Critical: X
- Warning: Y
- Info: Z

## Key Findings
- [top findings]

## Recommended Actions
- [next steps]
```

## Debug Report Template

```markdown
# Debug-NNN: [symptom title]

## Metadata
- Trigger: [debug / trace / user]
- Related Milestone: [Mx]
- Status: [confirmed / partial / unresolved]

## Symptom
- [error or behavior]

## Hypotheses
1. [candidate root cause]
2. [candidate root cause]

## Validation
- [how each hypothesis was checked]

## Root Cause
- [confirmed explanation]

## Fix Recommendation
- [diff or concrete code suggestion]

## Architecture Impact
- [none / required update]
```
