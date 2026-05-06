# M03 / F001 - Codex Continuation and Preflight Runtime

## Objective

Add file-backed continuation and preflight checks so Codex can continue safely even without Claude-style Stop hooks.

## 需求

- Add a continuation state contract that records next action, reason, updated timestamp, and safe resume command.
- Make `/hw:resume` and execution guidance prioritize continuation state when present.
- Integrate Codex `notify` as observability and recovery signal, not as a hidden runner.
- Add pre-completion checks for:
  - protected authority writes
  - YAML/JSON/Markdown format validity
  - stale derived artifacts
  - README freshness
  - output language expectations
  - secret leakage markers
  - missing report/progress/log evidence
- Keep Hypo-Workflow as a file-first protocol, not a background runner.
- Keep runtime implementation and validation separated:
  - implementation writes continuation/preflight helpers
  - validation checks failure fixtures and blocking/warning classification
- Use Codex Subagents for focused runtime review or test review when available.

## Boundaries

- In scope:
  - `core/src/lease/` or a new continuation helper if appropriate
  - `core/src/sync/index.js`
  - `core/src/docs/index.js`
  - `hooks/codex-notify.sh`
  - `references/platform-codex.md`
  - `references/commands-spec.md`
  - `skills/resume/SKILL.md`
  - `skills/start/SKILL.md`
  - focused tests under `core/test/`
- Do not implement OpenCode plugin-event changes in this milestone.
- Do not rely on Codex hooks to mutate lifecycle state automatically.
- Do not introduce an external model selection surface for Codex continuation.

## Implementation Plan

1. Ask a test/review Subagent to propose failure fixtures for continuation and preflight, if available.
2. Add failing tests for continuation read/write and resume priority.
3. Add failing tests for preflight warnings/errors with small fixture projects.
4. Implement continuation contract under `.pipeline/continuation.yaml` or an existing lifecycle location if one already fits.
5. Add preflight helpers with deterministic result objects.
6. Run a lightweight challenger pass over blocking vs warning classifications.
7. Update Codex notify docs/script to surface incomplete state and next action.
8. Update start/resume guidance to continue ordinary execution when automation policy allows it.
9. Run focused and full validation.

## 预期测试

- Resume chooses continuation state before generic current state when continuation is active.
- Preflight blocks or warns on protected authority inconsistencies.
- Preflight detects stale derived files and README freshness gaps.
- Preflight treats missing optional Codex notify as warning, not failure.
- Secret markers are detected or routed through existing redaction checks.
- Report generation records whether Subagent review was used for preflight or continuation tests.

## Validation Commands

- `node --test core/test/execution-lease.test.js`
- `node --test core/test/sync-derived-map.test.js`
- `node --test core/test/docs-governance.test.js`
- `node --test core/test/*.test.js`
- `python3 tests/run_regression.py`
- `git diff --check`

## Evidence

- Include continuation fixture output.
- Include preflight pass/fail examples.
- State which checks are blocking vs warning.
- Include the challenger pass decision for any ambiguous check.

## 预期产出

- Continuation contract and helpers.
- Codex preflight runtime/check docs.
- Updated resume/start behavior guidance.
- `.pipeline/reports/02-codex-continuation-and-preflight-runtime.report.md`
