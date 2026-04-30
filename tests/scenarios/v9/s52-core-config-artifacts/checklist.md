# s52 — Core Config and Artifacts

Validate the first shared V9 core helper layer.

- `core/` exists and is clearly a helper, not a runner.
- Unit tests cover config load/write, profile parsing, OpenCode command map generation, rules summary, and OpenCode artifact rendering.
- `core/bin/hw-core` can emit OpenCode command JSON and rules summaries.
- Existing `scripts/rules-summary.sh` still runs.
