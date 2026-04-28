# System Test Checklist: s36-import-history-non-git

- Scenario: `s36-import-history-non-git`
- Goal: Verify non-Git History Import failure is defined.

## Checks

- [ ] Non-Git repos stop with a clear Chinese error.
- [ ] The command checks `git rev-parse --is-inside-work-tree`.
