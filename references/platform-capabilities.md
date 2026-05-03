# V9 Platform Capabilities

Hypo-Workflow remains a single workflow system with platform adapters. V9 adds OpenCode native mapping without reducing the Codex or Claude Code experience.

## Capability Matrix

| Capability | Codex | Claude Code | OpenCode | V9 decision |
|---|---|---|---|---|
| User command surface | `/hw:*` skill invocation | `/hypo-workflow:*` plugin commands | `/hw-*` native slash commands | Keep canonical HW names in docs; generate platform aliases. |
| Skill loading | Native Codex skills | Claude plugin skills | OpenCode command/agent files plus plugin context | Core content stays shared; adapters render it. |
| Interactive questions | Direct chat or Codex UI prompts where available | Direct chat / tool prompts where available | Native `question` tool | Plan gates prefer OpenCode Ask, fallback to explicit chat elsewhere. |
| Plan tool / todos | Codex plan tool, best-effort discipline | Prompt-managed plan/checklists | Native `todowrite` | Add shared plan-discipline prompts; OpenCode gets enforced todo usage. |
| Subagents | Available in Codex sessions | Available in Claude Code workflows where configured | Native agents and subagents | Map HW explorer/worker/reviewer roles per platform. |
| Hooks/events | Limited from the HW side | Claude hooks for session/start/stop behavior | Plugin events for command/tool/session/todo/permission | OpenCode gets richer automation; shared state contract remains unchanged. |
| Permissions | Environment/sandbox controlled | Claude permissions/hooks | Native allow/ask/deny rules | Use native controls where present; keep HW file guard as policy. |
| Recovery signal | Structured lease + heartbeat | Structured lease + heartbeat/hooks | Structured lease + heartbeat/plugin events | Lease/heartbeat timeout is the portable recovery signal; platform failures add `reported_failure` when available. |
| Rules/instructions | `SKILL.md` + rules files | `SKILL.md` + plugin context | `AGENTS.md`, instructions, plugin context | Export HW rules to native instructions without replacing `.pipeline/rules.yaml`. |
| Model routing | Host-provided model selection | Host-provided model selection | Native provider/model/variant config | V9 uses OpenCode native model config first; HW router only if a platform lacks enough control later. |
| Context compaction | Compact files + skill policy | Compact files + hooks | Plugin compaction hook + compact files | OpenCode can inject compact summaries natively. |
| MCP | Host dependent | Host dependent | Native local/remote MCP | Optional integration, not part of V9 parity baseline. |
| Dashboard | Existing HW WebUI | Existing HW WebUI | Existing HW WebUI | No adapter-specific rewrite in M0. |

## No degradation

V9 must not degrade Codex or Claude Code.

- Existing `/hw:*` and `/hypo-workflow:*` command behavior remains valid.
- Shared workflow semantics stay in common specs and generated skill content, not in an OpenCode-only runner.
- OpenCode-only features are additive adapter capabilities. They may improve Ask, todowrite, hooks, and permissions on OpenCode, but cannot become required for Codex/Claude execution.
- Codex/OpenCode/Claude handoff must preserve the strictest permission, network, destructive/external-side-effect, and auto-continue boundaries. Handoff may not widen permissions without explicit confirmation.
- New `core/` helpers must emit the same `.pipeline/` contracts currently consumed by Codex and Claude Code.
- Regression tests continue to validate existing scenarios before OpenCode-specific smoke tests are considered green.

## Adapter Responsibilities

| Layer | Codex adapter | Claude Code adapter | OpenCode adapter |
|---|---|---|---|
| Command rendering | Keep root `SKILL.md` and child skills. | Keep `.claude-plugin` metadata and command docs. | Generate `.opencode/commands/*.md`. |
| Context bootstrap | Read compact/runtime files through skill policy. | SessionStart hook loads runtime files. | Plugin injects compact runtime files and current command context. |
| Interactive gates | Ask user in chat and wait. | Ask user in chat/tool flow and wait. | Use `question` tool whenever interaction is required. |
| Plan discipline | Strengthen prompt instructions to use the available plan tool. | Strengthen prompt instructions and checkpoints. | Bind `/hw-plan*` to `hw-plan` and require `todowrite`. |
| Auto continue | Respect `evaluation.auto_continue`; limited by host support. | Respect existing hooks and watchdog. | Use OpenCode events with safe default enabled. |

## Open Questions Deferred Past M0

- Exact TypeScript API shape for generated OpenCode plugin code.
- Whether OpenCode model variants are sufficient for every HW model-router use case.
- Whether MCP should be configured by `/hw:setup` in V9 or kept as a later optional pack.
