# M07 / F001 - Manual Smoke and Release Readiness

## Objective

- Produce a manual Claude Code smoke flow in a temporary fixture project and complete release-readiness validation for the C6 adapter.

## 需求

- Build a repeatable manual smoke checklist for a temporary project.
- The smoke must cover:
  - plugin installation or local plugin validation
  - `sync --platform claude-code`
  - `.claude/settings.local.json` merge and backup behavior
  - `/hw:*` alias behavior
  - `/hw:status` or status fallback output
  - Stop hook strict block behavior
  - compact resume injection
  - PermissionRequest auto-continue behavior by profile
  - DeepSeek docs role and Mimo code/test role routing
- Update docs so a user can run the smoke without reading implementation code.
- Run final automated regressions and record exact commands.
- Do not perform real marketplace publication.

## Boundaries

- In scope:
  - temporary smoke fixture scripts or docs
  - release readiness checklist
  - final docs updates
  - final report
  - final regression validation
- If live Claude Code cannot be executed in the current environment, produce a clear manual checklist and run all local deterministic validations.

## Non-Goals

- Do not push tags, publish packages, or perform external marketplace side effects.
- Do not require provider credentials in automated tests.
- Do not mutate user global Claude settings.

## Implementation Plan

1. Add or update smoke fixture documentation and scripts.
2. Add tests that verify the smoke fixture files and expected commands exist.
3. Run final plugin validation and regression commands.
4. If Claude Code monitor or live hook behavior cannot be fully automated locally, write manual steps and expected observations.
5. Update README/platform docs with concise C6 usage.
6. Generate the final milestone report and acceptance checklist.

## 预期测试

- Smoke fixture/checklist includes every required action.
- Local deterministic tests pass.
- Plugin validation passes or local CLI unavailability is explicitly recorded.
- Docs mention developer/standard/strict profiles and model routing smoke.
- No OpenCode/Codex regression appears in the full test suite.

## Validation Commands

- `node --test core/test/claude-smoke-readiness.test.js`
- `claude plugin validate .`
- `bash scripts/validate-config.sh .pipeline/config.yaml`
- `node --test core/test/*.test.js`
- `python3 tests/run_regression.py`
- `git diff --check`

## Evidence

- Record final automated command results.
- Record the manual Claude Code smoke checklist.
- Record any environment limitations.
- Record follow-up items for MCP/LSP/Worktree hooks or marketplace publishing.

## Human QA

- User manually runs the temporary-project Claude Code smoke.
- User confirms whether status display and model routing behavior are acceptable.

## 预期产出

- Manual smoke checklist or fixture.
- Final docs updates.
- Release-readiness evidence.
- `.pipeline/reports/06-claude-manual-smoke-and-release-readiness.report.md`
