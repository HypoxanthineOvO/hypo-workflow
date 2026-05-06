# C6 Plan Confirm Summary

## 项目

- Name: Claude Code Adapter Plugin and Full Workflow Takeover
- Cycle: C6
- Workflow kind: build
- Preset: tdd
- Planning mode: interactive / high
- Plan shape: single Feature, seven serial Milestones

## 核心目标

增强现有 Claude Code plugin/Skill 适配，而不是重写它。C6 将补齐 `/hw:*` alias、Claude settings merge、Hook runtime、subagent model routing、Progress-like status display、manual smoke 和 marketplace-ready validation。

## Milestones

| # | Milestone | Prompt |
|---|---|---|
| M01 | Claude Adapter Contract and Config | `.pipeline/prompts/00-claude-adapter-contract-and-config.md` |
| M02 | Plugin Skill Alias and Marketplace Package | `.pipeline/prompts/01-claude-plugin-skill-alias-and-marketplace-package.md` |
| M03 | Claude Settings Merge and Sync | `.pipeline/prompts/02-claude-settings-merge-and-sync.md` |
| M04 | Claude Hook Runtime | `.pipeline/prompts/03-claude-hook-runtime.md` |
| M05 | Claude Subagent Model Routing | `.pipeline/prompts/04-claude-subagent-model-routing.md` |
| M06 | Claude Progress Status Surface | `.pipeline/prompts/05-claude-progress-status-surface.md` |
| M07 | Manual Smoke and Release Readiness | `.pipeline/prompts/06-claude-manual-smoke-and-release-readiness.md` |

## 验证点

- Config/schema/profile validation.
- Claude plugin alias and marketplace package validation.
- Safe `.claude/settings.local.json` merge with backups and conflict handling.
- Hook fixture tests for Stop, SessionStart, compact, permission, tool, and Progress refresh events.
- Model routing tests for DeepSeek docs and Mimo code/test roles.
- Progress-like status model and fallback validation.
- Final manual Claude Code smoke in a temporary project.

## Generated Files

- `.pipeline/design-spec.md`
- `.pipeline/architecture.md`
- `.pipeline/prompts/00-claude-adapter-contract-and-config.md`
- `.pipeline/prompts/01-claude-plugin-skill-alias-and-marketplace-package.md`
- `.pipeline/prompts/02-claude-settings-merge-and-sync.md`
- `.pipeline/prompts/03-claude-hook-runtime.md`
- `.pipeline/prompts/04-claude-subagent-model-routing.md`
- `.pipeline/prompts/05-claude-progress-status-surface.md`
- `.pipeline/prompts/06-claude-manual-smoke-and-release-readiness.md`
- `.plan-state/discover.yaml`
- `.plan-state/decompose.yaml`
- `.plan-state/generate.yaml`

## Confirm Gate

当前处于 `plan_confirm`。确认后运行 `/hw:start` 即可从 M01 开始执行。
