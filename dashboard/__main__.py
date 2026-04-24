from __future__ import annotations

import argparse

from .server import run_server


def main() -> None:
    parser = argparse.ArgumentParser(description="Hypo-Workflow Dashboard")
    parser.add_argument("command", choices=["serve"], help="Command to run")
    parser.add_argument("--dir", default=".pipeline/", help="Pipeline directory to watch")
    parser.add_argument("--port", type=int, default=7700, help="Server port")
    parser.add_argument("--host", default="0.0.0.0", help="Server host")
    parser.add_argument("--shutdown-delay", type=int, default=30, help="Seconds to wait before auto shutdown after all websocket clients disconnect")
    args = parser.parse_args()

    if args.command == "serve":
        run_server(directory=args.dir, port=args.port, host=args.host, shutdown_delay=args.shutdown_delay)


if __name__ == "__main__":
    main()
