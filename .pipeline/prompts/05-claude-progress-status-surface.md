# M06 / F001 - Claude Progress Status Surface

## Objective

- Expose a compact Progress-style status surface for Claude Code, with monitor-first behavior and validated fallbacks.

## 需求

- Status display should show the useful parts of `.pipeline/PROGRESS.md`, not the entire Markdown file.
- Required display sections:
  - milestone/progress table
  - current phase and next action
  - automation settings and safety profile
  - recent events
- Refresh should be event-driven on lifecycle updates and `.pipeline/PROGRESS.md` changes.
- Prefer Claude Code monitor/status surfaces if validated.
- If monitor support is missing or too limited, provide a clear report and fallback implementations:
  - `/hw:status` alias output
  - SessionStart/Stop injected summary
  - external dashboard link or launch guidance

## Boundaries

- In scope:
  - status model helper for Claude
  - monitor artifact exploration or implementation
  - `/hw:status` fallback integration
  - Progress table parser/renderer where needed
  - docs explaining fallback order
- Reuse existing status/progress helpers when possible.
- Keep status read-only.

## Non-Goals

- Do not create a new full workflow action center.
- Do not make dashboard startup automatic without explicit user command or configured behavior.
- Do not block workflow execution only because monitor refresh failed.
- Do not paste raw logs or secrets into status surfaces.

## Implementation Plan

1. Add tests for rendering a compact Progress-like model from `.pipeline/PROGRESS.md`, state, config, and log.
2. Validate whether Claude Code monitor packaging is available in the plugin contract.
3. Implement monitor output if practical; otherwise implement and document the fallback path.
4. Wire status refresh triggers from hook/runtime events where appropriate.
5. Update `/hw:status` alias guidance to use the same model.
6. Document limitations and validated alternatives.

## 预期测试

- Status model renders milestone table rows.
- Status model renders automation/profile basics.
- Recent events are sorted and secret-safe.
- Missing monitor capability produces a clear limitation report, not silent failure.
- `/hw:status` fallback uses the same status model.

## Validation Commands

- `node --test core/test/claude-status-surface.test.js`
- `node --test core/test/opencode-status.test.js`
- `node --test core/test/progress-table.test.js`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Record one status output sample.
- Record monitor capability finding and fallback decision.
- Record event-driven refresh behavior.

## Human QA

- Confirm the status view has enough information without being noisy.
- Confirm fallback wording is acceptable if Claude Code monitor support is limited.

## 预期产出

- Claude status model and tests.
- Monitor or fallback status artifact.
- Updated `/hw:status` alias/docs.
- `.pipeline/reports/05-claude-progress-status-surface.report.md`
