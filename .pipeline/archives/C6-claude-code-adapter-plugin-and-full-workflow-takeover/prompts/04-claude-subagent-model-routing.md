# M05 / F001 - Claude Subagent Model Routing

## Objective

- Generate Claude Code agents/subagents from shared model role configuration, with declaration-first defaults and dynamic selection support.

## 需求

- Claude Code subagent model routing is a core C6 requirement.
- Use shared `model_pool.roles` as the canonical source unless `claude_code` role overrides exist.
- Support default mappings:
  - docs -> `deepseek-v4-pro`
  - code/test -> `mimo-v2.5-pro`
  - report/compact -> `deepseek-v4-flash`
  - plan/review/debug -> shared model pool or explicit override
- Generate Claude agent/subagent definitions in the expected project-local path.
- Dynamic selection should refine role choice based on milestone type, Test Profile, retry/failure state, and task category.
- The generated artifacts or metadata must make routing decisions inspectable.

## Boundaries

- In scope:
  - Claude agent artifact writer
  - model role resolver
  - generated `.claude/agents/*.md` fixture outputs
  - tests for role defaults and overrides
  - docs for DeepSeek + Mimo smoke
- Avoid provider-specific hardcoding when preserving configured IDs is enough.
- Keep OpenCode model matrix behavior unchanged.

## Non-Goals

- Do not call models directly.
- Do not require live provider credentials for automated tests.
- Do not implement a full scheduler.
- Do not overwrite user-owned `.claude/agents` without merge/conflict handling from M03.

## Implementation Plan

1. Add failing tests for Claude role-to-agent rendering.
2. Add tests for DeepSeek docs role and Mimo code/test role.
3. Add dynamic selection tests for task category and failure/retry refinement.
4. Implement model role resolver that reuses or mirrors existing OpenCode model pool derivation without coupling to OpenCode artifact formats.
5. Generate Claude agent/subagent definitions and sidecar metadata.
6. Update docs with examples and smoke expectations.

## 预期测试

- `docs` role generates `deepseek-v4-pro`.
- `code` or `test` role generates `mimo-v2.5-pro`.
- Explicit project overrides win over defaults.
- Dynamic refinement changes the selected role when a test/debug/docs scenario calls for it.
- Existing OpenCode model matrix tests remain green.

## Validation Commands

- `node --test core/test/claude-model-routing.test.js`
- `node --test core/test/model-pool-actions.test.js`
- `node --test core/test/opencode-model-matrix-docs.test.js`
- `node --test core/test/*.test.js`
- `git diff --check`

## Evidence

- Record generated Claude agent examples for docs and code/test roles.
- Record dynamic selection examples.
- Record compatibility with existing model pool tests.

## Human QA

- Confirm generated model IDs match the local model names you expect to use in Claude Code.
- Confirm docs explain how to override role models.

## 预期产出

- Claude model routing helper and tests.
- Generated agent/subagent artifacts.
- Updated config/docs references.
- `.pipeline/reports/04-claude-subagent-model-routing.report.md`
