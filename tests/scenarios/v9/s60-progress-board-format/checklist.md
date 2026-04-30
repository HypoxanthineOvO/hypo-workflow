# s60 — PROGRESS Board Format

Validate that `PROGRESS.md` keeps the human-readable board layout instead of drifting into a loose append-only event log.

- `references/progress-spec.md` requires board-style summary.
- Patch Fix instructions update the Patch table and timeline instead of appending one-line entries.
- Current `.pipeline/PROGRESS.md` contains top metadata, Milestone table, timeline table, Patch table, and Deferred section.
