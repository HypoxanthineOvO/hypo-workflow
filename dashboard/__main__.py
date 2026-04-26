from __future__ import annotations

import argparse
from pathlib import Path
from typing import Any

import yaml

from .server import run_server


GLOBAL_CONFIG = Path.home() / ".hypo-workflow" / "config.yaml"


def load_global_dashboard_defaults() -> dict[str, Any]:
    if not GLOBAL_CONFIG.exists():
        return {}
    data = yaml.safe_load(GLOBAL_CONFIG.read_text(encoding="utf-8")) or {}
    if not isinstance(data, dict):
        return {}
    dashboard = data.get("dashboard", {})
    return dashboard if isinstance(dashboard, dict) else {}


def main() -> None:
    parser = argparse.ArgumentParser(description="Hypo-Workflow Dashboard")
    parser.add_argument("command", choices=["serve"], help="Command to run")
    parser.add_argument("--dir", default=".pipeline/", help="Pipeline directory to watch")
    parser.add_argument("--port", type=int, default=None, help="Server port")
    parser.add_argument("--host", default="0.0.0.0", help="Server host")
    parser.add_argument("--shutdown-delay", type=int, default=None, help="Seconds to wait before auto shutdown after all websocket clients disconnect")
    args = parser.parse_args()

    if args.command == "serve":
        dashboard_defaults = load_global_dashboard_defaults()
        port = args.port if args.port is not None else int(dashboard_defaults.get("port", 7700))
        shutdown_delay = args.shutdown_delay if args.shutdown_delay is not None else int(dashboard_defaults.get("shutdown_delay", 30))
        run_server(directory=args.dir, port=port, host=args.host, shutdown_delay=shutdown_delay)


if __name__ == "__main__":
    main()
