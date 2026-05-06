# M04 / F001 - Claude Hook Runtime

## Objective

- Implement Claude Code hook wrappers over shared Hypo-Workflow policy for lifecycle correctness, compact recovery, permission continuity, and Progress/status refresh.

## 需求

- Use shared core policy where possible and Claude-specific wrappers for event contracts.
- Cover initial events:
  - `SessionStart`
  - `Stop`
  - `PreCompact`
  - `PostCompact`
  - `PostToolUse`
  - `PostToolBatch`
  - `UserPromptSubmit`
  - `PermissionRequest`
  - `FileChanged(.pipeline/PROGRESS.md)`
- Stop must block workflow-critical missing state, log, Progress, report, or required Test Profile evidence.
- Stop should warn but not block for metrics and derived refresh gaps.
- Compact hooks must inject a short resume packet that prevents replaying completed steps.
- PermissionRequest must continue automation when effective Hypo-Workflow config allows it, while published `standard` remains conservative for destructive or external side effects.
- Hook outputs must respect Claude Code event-specific stdout/stderr/exit-code contracts.

## Boundaries

- In scope:
  - new `core/src/claude-hooks/` helper or equivalent
  - Claude shell/Node hook wrappers under `hooks/`
  - settings registration from M03
  - hook fixture tests
  - docs and references for hook behavior
- Reuse existing `hooks/session-start.sh` and `hooks/stop-check.sh` logic only when it matches Claude Code contracts; otherwise wrap or split safely.

## Non-Goals

- Do not auto-repair workflow state from hooks by default.
- Do not implement MCP/LSP hooks.
- Do not implement WorktreeCreate/Remove behavior beyond documenting future support.
- Do not hide hook failures from the user.

## Implementation Plan

1. Add hook input/output fixture tests for each initial event.
2. Add Stop tests for hard blockers and warning-only gaps.
3. Add compact tests that verify resume context includes current Cycle/Milestone/step, next action, required files, automation boundary, and recent events.
4. Add PermissionRequest tests for `developer`, `standard`, and `strict`.
5. Implement shared policy helpers and Claude wrappers.
6. Wire hook commands into generated settings.
7. Update docs with event contracts and fallback guidance.

## 预期测试

- `SessionStart` injects current pipeline context when a pipeline exists.
- `Stop` blocks missing critical workflow evidence.
- `Stop` warns or allows metrics/derived gaps.
- `PreCompact/PostCompact` provide resume-oriented context.
- `PermissionRequest` respects effective config and safety profile.
- Hook fixture outputs parse as valid JSON where required.

## Validation Commands

- `node --test core/test/claude-hooks.test.js`
- `bash -n hooks/*.sh`
- `node --test core/test/knowledge-hooks.test.js core/test/opencode-hooks.test.js`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Record sample Stop block output.
- Record sample compact resume packet.
- Record PermissionRequest decisions for `developer`, `standard`, and `strict`.

## Human QA

- Confirm the Stop block messages are helpful rather than cryptic.
- Confirm compact recovery text is concise enough for Claude Code context.

## 预期产出

- Claude hook policy and wrapper implementation.
- Hook fixture tests.
- Updated generated settings hook registration.
- Updated Claude platform docs.
- `.pipeline/reports/03-claude-hook-runtime.report.md`
