# System Test Checklist: s32-import-history-keyword

- Scenario: `s32-import-history-keyword`
- Goal: Verify keyword-based History Import splitting is documented and configurable.

## Checks

- [ ] `history_import.keyword_patterns` exists in schema.
- [ ] `feat\(M(\d+)\):`, `M(\d+)-`, and `milestone-(\d+)` patterns are documented.
- [ ] Keyword commits cluster into milestones.
