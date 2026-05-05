# Execution Report: M08 - Layered Global Sync and Derived Artifact Map

## Summary
- Prompt: 07-layered-global-sync-and-derived-artifact-map
- Started: 2026-05-03T22:32:01+08:00
- Finished: 2026-05-03T22:49:00+08:00
- Result: pass
- Diff Score: 2/5

## Changes
- Added a declared derived artifact map for compact views, metrics/report mirrors, project summary, OpenCode metadata, and managed docs blocks.
- Added `/hw:sync --check-only` semantics that detect external changes and derived drift without writing.
- Added safe `/hw:sync --repair` refresh for declared safe derived views while refusing protected authority conflicts.
- Wrote derived health to `.pipeline/derived-health.yaml` and surfaced it in the OpenCode status model/sidebar/footer.
- Updated CLI and sync skill docs for `--check-only`, `--repair`, protected authority boundaries, and derived health.

## Tests
- Red: `node --test core/test/sync-derived-map.test.js` failed because the derived map helper was missing.
- Green: `node --test core/test/sync-derived-map.test.js`
- Focused regression: `node --test core/test/sync-derived-map.test.js core/test/sync-standardization.test.js core/test/opencode-status.test.js`
- Project repair sync: `node cli/bin/hypo-workflow sync --repair --project /home/heyx/Hypo-Workflow`

## Notes
- Repair sync refreshed `PROGRESS.compact.md`, `metrics.compact.yaml`, `reports.compact.md`, and `PROJECT-SUMMARY.md`.
- `README.md` remains a declared stale narrative/managed docs surface and is intentionally routed to `/hw:docs repair` in M10 rather than silently rewritten by sync.

## Evaluation
- tests_pass: pass
- no_regressions: pass
- matches_plan: pass
- code_quality: pass
- Decision: pass

## Next
Proceed to M09 for Log Ledger, Recent Feed, and Secret-Safe Evidence.
