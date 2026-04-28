# System Test Checklist: s35-import-history-interactive

- Scenario: `s35-import-history-interactive`
- Goal: Verify interactive History Import is a hard confirmation gate.

## Checks

- [ ] `--interactive` is documented for `/hw:init --import-history`.
- [ ] The agent must wait for explicit confirmation.
- [ ] Users may merge, split, rename, or switch signals.
