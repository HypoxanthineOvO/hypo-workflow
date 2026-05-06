# System Test Checklist: s63-init-automation-non-git

- Scenario: `s63-init-automation-non-git`
- Goal: Verify CLI project bootstrap works without Git and writes a stable automation level.

## Checks

- [ ] `init-project --automation full` succeeds in a non-Git temp directory.
- [ ] Generated config stores only `automation.level`.
- [ ] `scripts/validate-config.sh` accepts valid automation levels.
- [ ] `scripts/validate-config.sh` rejects invalid automation levels.
