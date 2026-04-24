# Audit Spec

Use this reference for `/hw:audit`, the preventive code auditing workflow.

## Audit Dimensions

| Dimension | Code | Checks | Severity |
|---|---|---|---|
| Security | SEC | injection, auth, secrets, dependency risk, sensitive data exposure | Critical / Warning |
| Bugs | BUG | null handling, bounds, races, leaks, type mismatches | Critical / Warning |
| Architecture | ARCH | cycles, god modules, layer violations, interface drift, architecture.md delta | Warning / Info |
| Performance | PERF | hot-path O(n²), blocking IO, memory growth, avoidable repeated work | Warning / Info |
| Test Coverage | TEST | missing branches, edge cases, flaky tests, excessive mocks | Warning / Info |
| Code Quality | QUAL | dead code, magic numbers, naming drift, missing docs, duplication | Info |

## Flow

### Step 1: Scope

- audit the whole project by default
- support `--scope <dir>` and `--since <milestone>`
- read the architecture baseline before scanning modules

### Step 2: Scan

- scan all six dimensions by default
- support `--focus <dimension>` for one dimension only
- inspect files and modules in a structured pass

### Step 3: Grade

- `Critical`: must fix, especially security holes and data-loss risk
- `Warning`: should fix, including architecture drift and performance hazards
- `Info`: improvement suggestions such as quality cleanup

### Step 4: Output

- terminal summary with counts and top five findings
- full report at `.pipeline/audits/audit-NNN.md`
- lifecycle entry in `.pipeline/log.yaml` with `type: audit`

## Report Template

```markdown
# Audit Report — YYYY-MM-DD

## Summary
- Scope: [full project / dir]
- Files scanned: N
- Findings: X Critical, Y Warning, Z Info

## Critical (must fix)
- [SEC-01] file:line — description — fix suggestion
- [BUG-01] file:line — description — fix suggestion

## Warning (should fix)
- [ARCH-01] description — recommendation
- [PERF-01] file:line — description — recommendation

## Info (nice to have)
- [QUAL-01] description
- [TEST-01] description

## Architecture Delta
- [delta against architecture baseline, if any]
```
