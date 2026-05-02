# s61 — OpenCode model matrix sync

Validate that OpenCode model matrix configuration is rendered into generated artifacts without requiring a real OpenCode model call.

- Project `opencode.agents.*.model` overrides render into `.opencode/agents/*.md`.
- `opencode.compaction.effective_context_target` renders into `.opencode/hypo-workflow.json`.
- Root `opencode.json` keeps only OpenCode-compatible fields and does not receive HW-private `agents` or `effective_context_target` keys.
- Default sync still works for a legacy project with no matrix override.
