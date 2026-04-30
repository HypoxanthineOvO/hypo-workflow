# s54 — OpenCode Plugin Scaffold

Validate the OpenCode project adapter scaffold.

- `plugins/opencode/` contains a plugin template and project scaffold metadata.
- `hypo-workflow init-project --platform opencode` creates schema-valid `opencode.json`, `AGENTS.md`, `.opencode/hypo-workflow.json`, `.opencode/package.json`, `.opencode/plugins/hypo-workflow.ts`, and commands.
- Generated files include HW version and command map metadata.
- Plugin scaffold is an adapter/guard/context bridge, not an autonomous worker.
