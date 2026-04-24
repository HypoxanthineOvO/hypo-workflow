---
name: dashboard
description: Launch or manage the Hypo-Workflow WebUI when the user wants a live browser dashboard for pipeline state, logs, config, and reports.
---

# /hypo-workflow:dashboard

Use this skill to launch the Hypo-Workflow dashboard server in the background.

## Preconditions

- the repo contains the `dashboard/` directory
- `uv` is available
- the current project has a `.pipeline/` directory to visualize

## Startup Flow

1. Check whether dashboard dependencies are installed.
2. If not, install them with:
   - `uv pip install -r dashboard/requirements.txt`
3. Check whether a dashboard instance is already listening on the preferred port.
4. If one is already running:
   - tell the user
   - open the browser if possible
5. Otherwise start the server in the background with `nohup` and `&`.
6. Wait briefly, then check `/health`.
7. Open the browser to the running dashboard.

## Runtime Behavior

- the server must not block Claude or Codex
- it should run in the background
- if all websocket clients disconnect, the server should auto-exit after 30 seconds with no reconnection
- default port is `7700`
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
- `SKILL.md` — broader pipeline context if needed
