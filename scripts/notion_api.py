#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


def load_token(token_file: str | None) -> str:
    env_token = os.getenv("NOTION_TOKEN")
    if env_token:
        return env_token.strip()
    if token_file:
        return Path(token_file).read_text(encoding="utf-8").strip()
    raise SystemExit("Notion token is missing. Set NOTION_TOKEN or pass --token-file.")


def notion_request(token: str, api_base_url: str, notion_version: str, method: str, path: str, payload: dict | None = None) -> dict:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{api_base_url.rstrip('/')}{path}",
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Notion-Version": notion_version,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Notion API error {exc.code}: {body}") from exc
    except urllib.error.URLError as exc:
        raise SystemExit(f"Notion API request failed: {exc}") from exc


def main() -> int:
    parser = argparse.ArgumentParser(description="Minimal Notion API helper for Hypo-Workflow adapters.")
    parser.add_argument("--token-file")
    parser.add_argument("--api-base-url", default=os.getenv("NOTION_API_BASE_URL", "https://api.notion.com/v1"))
    parser.add_argument("--notion-version", default=os.getenv("NOTION_VERSION", "2022-06-28"))
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("me", help="Return the authenticated bot profile.")
    search = sub.add_parser("search", help="Search accessible Notion pages/databases.")
    search.add_argument("--query", default="")
    search.add_argument("--page-size", type=int, default=10)

    args = parser.parse_args()
    token = load_token(args.token_file)

    if args.command == "me":
        payload = notion_request(token, args.api_base_url, args.notion_version, "GET", "/users/me")
    elif args.command == "search":
        payload = notion_request(
            token,
            args.api_base_url,
            args.notion_version,
            "POST",
            "/search",
            {"query": args.query, "page_size": args.page_size},
        )
    else:
        raise SystemExit(f"Unknown command: {args.command}")

    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
