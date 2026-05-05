# Claude Code Guide

Commands: plugin-skill namespace.
Ask gates: chat.
Plan support: prompt-managed.

Hypo-Workflow does not run project work itself; the host agent performs the work using `.pipeline/` files.

## Adapter Contract

Claude Code support is built around the existing Hypo-Workflow plugin Skills. The Claude plugin name is intentionally `hw`, so Claude Code exposes the existing root `skills/` files directly as `/hw:*` entries.

The `/hw:*` entries must remain the existing workflow skills, not a separate workflow implementation.

Claude Code plugin components live at the plugin root. The `.claude-plugin/` directory is reserved for plugin metadata such as `plugin.json` and marketplace metadata; the real skill bodies remain in the root `skills/` directory. Because the plugin name is already `hw`, Hypo-Workflow does not generate `skills/hw-*` alias skills; doing so would expose duplicate commands like `/hw:hw-status`.

For local development smoke tests, start Claude Code with:

```bash
claude --plugin-dir <Hypo-Workflow repo>
```

`sync --platform claude-code` writes project-local hooks, agents, and settings, but it does not install or enable a Claude Code plugin by mutating global Claude plugin state.

## Settings

`hypo-workflow sync --platform claude-code` writes project-local `.claude/settings.local.json` safely: preserve existing user settings, create a backup before first mutation, set the managed main-session model from `claude_code.model` (default `deepseek-v4-pro`), optionally set project-local API env from `claude_code.api`, and report conflicts instead of silently overwriting user-owned entries.

Claude Code still speaks the Anthropic-compatible API surface. When routing to DeepSeek, `claude_code.api.base_url` must point to a compatible proxy or gateway, not a raw OpenAI-compatible `/chat/completions` endpoint unless that gateway translates requests.

```yaml
claude_code:
  model: deepseek-v4-pro
  api:
    base_url_env: DEEPSEEK_ANTHROPIC_BASE_URL
    api_key_env: DEEPSEEK_API_KEY
```

`base_url_env` and `api_key_env` read values from the sync process environment and write `ANTHROPIC_BASE_URL` / `ANTHROPIC_API_KEY` into `.claude/settings.local.json`. `base_url` and `api_key` are also supported for private local projects, but documentation and reports must avoid printing raw secrets.

The settings merge is marker-based. Hypo-managed hook groups carry `hypo_workflow_managed: true`, and `hypo_workflow.managed_by=hypo-workflow` records the managed keys. If a user-owned hook command or settings env overlaps a Hypo-managed value, sync reports `manual_confirmation_required=true` and leaves the settings file unchanged.

Backups use `.claude/settings.local.json.bak.YYYYMMDDHHMMSS` and are only created when an existing settings file will be changed.

## Hooks

Claude hook runtime uses `node hooks/claude-hook.mjs <EventName>` for Stop, SessionStart, compact, permission, tool, prompt, batch, and Progress file events.

- SessionStart and UserPromptSubmit inject concise resume context from `.pipeline/state.yaml`.
- Stop blocks missing critical workflow evidence and emits schema-compliant warnings for non-blocking gaps.
- Compact emits a short resume packet and tells the Agent not to replay completed steps.
- PermissionRequest follows the configured safety profile.
- Tool and Progress hooks expose a lightweight `.pipeline/PROGRESS.md` snapshot.

Safety profiles:

- `developer`: permissive local development profile.
- `standard`: published default; destructive commands and external side effects require confirmation.
- `strict`: conservative team or CI profile.

## Agents

Claude subagent routing generates `.claude/agents/hw-*.md` and `.claude/hypo-workflow-agents.json` from `model_pool.roles`, then applies explicit `claude_code.agents.<role>.model` overrides.

Default smoke expectations:

- docs role -> `deepseek-v4-pro`
- code role -> `mimo-v2.5-pro`
- test role -> `mimo-v2.5-pro`
- report/compact roles -> lightweight DeepSeek

Generated agent files are marker-managed and preserve user-owned same-name agents by reporting conflicts instead of overwriting them.

## Status Surface

The Progress-style status surface is read-only and reuses the same compact model for `/hw:status`, hook refresh payloads, and the plugin monitor fallback. It shows the milestone table, current phase/next action, automation/profile basics, safety profile, and recent events from `.pipeline/PROGRESS.md`, `.pipeline/state.yaml`, and `.pipeline/log.yaml`.

Status commands must not mutate `state.yaml`, logs, reports, progress files, or milestone pointers. If state/log/progress are inconsistent, status should report the inconsistency and recommend a repair command instead of advancing workflow state.

Claude Code plugin monitors are packaged through `monitors/monitors.json`, but C6 treats them as a notification/fallback layer rather than a persistent native status panel. If a native monitor panel is unavailable or too limited, use this fallback order: `/hw:status`, SessionStart/Stop injected summary, then dashboard launch guidance.

## Manual Smoke

Run the full manual checklist in `docs/platforms/claude-code-smoke.md` before accepting a Claude Code adapter Cycle. The live smoke should cover plugin validation, project-local settings merge, API env override, `/hw:status`, `/hw:resume`, Stop hook behavior, compact resume injection, permission profiles, and DeepSeek/Mimo model routing.
