# System Test Checklist: s31-import-history-tags

- Scenario: `s31-import-history-tags`
- Goal: Verify History Import tag splitting is documented.

## Checks

- [ ] `/hw:init --import-history` is documented.
- [ ] Tag splitting uses `git tag --sort=creatordate`.
- [ ] Cycle 0 Legacy archive output is documented.
