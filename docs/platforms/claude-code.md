# Claude Code Guide

Commands: plugin-skill.
Ask gates: chat.
Plan support: prompt-managed.

Hypo-Workflow does not run project work itself; the host agent performs the work using `.pipeline/` files.

## Plugin Namespace

The Claude Code plugin name is intentionally `hw`, so existing workflow skills surface as `/hw:*` commands.

- The adapter uses the root `skills/` directory and existing workflow skills.
- It does not generate `skills/hw-*` alias skills.
- Settings are merged through project-local `settings.local_file` policy.
- DeepSeek and Mimo may be used through Claude Code agent routing when configured; this is separate from Codex Subagents.
