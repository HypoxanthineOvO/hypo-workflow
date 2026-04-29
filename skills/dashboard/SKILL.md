---
name: dashboard
description: Launch or manage the Hypo-Workflow WebUI when the user wants a live browser dashboard for pipeline state, logs, config, and reports.
---

# /hypo-workflow:dashboard
## Output Language Rules

📌 输出语言规则：
读取 config.yaml → output.language
- zh-CN / zh：所有用户可见的输出使用中文（PROGRESS、报告、状态提示、错误消息、交互提问）
- en：使用英文
- auto：跟随用户对话语言
内部日志（log.yaml、state.yaml）始终英文。

Use this skill to launch the Hypo-Workflow dashboard server in the background.

## Preconditions

- the repo contains the `dashboard/` directory
- `uv` is available
- the current project has a `.pipeline/` directory to visualize

## Startup Flow

1. Read `~/.hypo-workflow/config.yaml` if present.
2. Read `.pipeline/config.yaml` if present.
3. Resolve dashboard defaults as project > global > defaults:
   - `dashboard.enabled`: project value > global value > `false`
   - `dashboard.port`: project value > global value > `7700`
4. Check whether dashboard dependencies are installed.
5. If not, install them with:
   - `uv pip install -r dashboard/requirements.txt`
6. Check whether a dashboard instance is already listening on the preferred port.
7. If one is already running:
   - tell the user
   - open the browser if possible
8. Otherwise start the server in the background with `nohup` and `&`.
9. Wait briefly, then check `/health`.
10. Open the browser to the running dashboard.

## Runtime Behavior

- the server must not block Claude or Codex
- it should run in the background
- if all websocket clients disconnect, the server should auto-exit after 30 seconds with no reconnection
- default port is `7700`
- global setup can override the default port through `~/.hypo-workflow/config.yaml`
- if `7700` is busy, probe upward until a free port is found

## Troubleshooting

- dependency missing:
  - run `uv pip install -r dashboard/requirements.txt`
- port already in use:
  - try the next free port
- browser open command unavailable:
  - print the dashboard URL instead

## Reference Files

- `dashboard/server.py` — backend routes, websocket logic, and file watching
- `dashboard/__main__.py` — CLI entrypoint
- `dashboard/requirements.txt` — dependencies
- `references/config-spec.md` — dashboard config fallback rules
- `SKILL.md` — broader pipeline context if needed
