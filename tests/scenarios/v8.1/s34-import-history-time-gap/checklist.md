# System Test Checklist: s34-import-history-time-gap

- Scenario: `s34-import-history-time-gap`
- Goal: Verify time-gap fallback splitting is documented and configurable.

## Checks

- [ ] `history_import.time_gap_threshold` exists.
- [ ] Default threshold is `24h`.
- [ ] Time-gap split is the final auto fallback.
