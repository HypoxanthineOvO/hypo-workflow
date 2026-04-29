# System Test Checklist: s41-full-view-flags

- Scenario: `s41-full-view-flags`
- Goal: Verify compact bypass flags.

## Checks

- [ ] `/hw:status --full` loads full state/progress.
- [ ] `/hw:log --full` loads full log.
- [ ] `/hw:report --view M3` loads a full report.
- [ ] Compact remains the default when available.
