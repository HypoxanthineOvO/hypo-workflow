# Platform Guide: Claude Code

Use this reference when the pipeline runs inside Claude Code.

## Environment Shape

- Hook support is rich and event-driven.
- Plugin packaging is supported through `.claude-plugin/plugin.json`.
- Dedicated subagent definitions normally live in `.claude/agents/`.
- Additional instruction files can live in `CLAUDE.md` and `.claude/rules/*.md`.

## Recommended Settings Template

Example `/.claude/settings.local.json`:

```json
{
  "hooks": {},
  "agents": {},
  "plugins": [
    "../.claude-plugin/plugin.json"
  ]
}
```

## Hook 手动安装

将以下内容添加到 `.claude/settings.local.json`：

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/stop-check.sh",
            "timeout": 5000
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "startup|clear",
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/session-start.sh startup",
            "timeout": 3000
          }
        ]
      },
      {
        "matcher": "resume",
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/session-start.sh resume",
            "timeout": 3000
          }
        ]
      },
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "bash hooks/session-start.sh compact",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

## Plugin Installation

Typical flow:

1. place the skill directory in the repository
2. point Claude Code at `.claude-plugin/plugin.json`
3. verify that `SKILL.md` resolves through the plugin manifest
4. run `/hypo-workflow:setup` to create `~/.hypo-workflow/config.yaml`

To use Codex for delegated steps, install `@openai/codex`, configure `OPENAI_API_KEY`, and set global `subagent.provider=codex` through setup.

## Subagent Paths

Preferred order:

1. `.claude/agents/<name>.md`
2. built-in Claude subagent routing
3. `claude -p` for explicit non-interactive delegation

## Hook Usage Guidance

Claude hooks can enrich the pipeline with:

- prompt start summaries
- decision-block stop enforcement
- state snapshotting
- structured event propagation through `additionalContext`

Key V3 behavior:

- Stop Hook can block premature termination with `decision:block`
- SessionStart reinjects pipeline state on startup, resume, and compact
- InstructionsLoaded can observe `SKILL.md` loads without changing control flow

Even in Claude Code, hooks should reinforce the state machine, not replace it.
