# M3 Report — OpenCode Plugin Scaffold and Project Adapter

## Summary

M3 added the first OpenCode adapter scaffold under `plugins/opencode/` and extended project initialization to generate OpenCode project files.

## Changes

- Added `plugins/opencode/README.md`.
- Added OpenCode templates for `AGENTS.md`, `.opencode/package.json`, and `.opencode/plugins/hypo-workflow.ts`.
- Extended `writeOpenCodeArtifacts()` to generate project root `opencode.json`, `AGENTS.md`, `.opencode/commands/`, `.opencode/agents/`, `.opencode/plugins/`, and `.opencode/package.json`.
- Updated `hypo-workflow sync` and `init-project` to use the project-level scaffold shape.
- Added `s54-opencode-plugin-scaffold` regression coverage.
- Updated README and V9 architecture references.

## Verification

- `bash tests/scenarios/v9/s54-opencode-plugin-scaffold/run.sh` — passed
- `node --test core/test/*.test.js` — passed, 8/8
- `claude plugin validate .` — passed
- `python3 tests/run_regression.py` — passed, 54/54
- `git diff --check` — passed

## Score

- Tests: pass
- Regression: pass
- Scope: static scaffold only; no OpenCode runtime required
- Codex/Claude compatibility: unchanged
