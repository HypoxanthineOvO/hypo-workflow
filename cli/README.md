# Hypo-Workflow CLI

`hypo-workflow` is a setup utility, not a runner. It manages global defaults, profiles, adapter sync, doctor checks, and project bootstrap files. Pipeline execution still happens inside Codex, Claude Code, or OpenCode agents.

## Commands

```bash
hypo-workflow setup
hypo-workflow doctor
hypo-workflow sync --platform opencode --project .
hypo-workflow profile list
hypo-workflow profile use opencode
hypo-workflow profile edit opencode --model qwen
hypo-workflow install opencode
hypo-workflow init-project --platform opencode --project .
```

When no command is provided, the CLI runs `setup` on first use and shows a small setup menu afterwards.
