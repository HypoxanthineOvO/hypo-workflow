#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import re
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


def load_fixture(fixture_dir: str | None, name: str) -> dict:
    if not fixture_dir:
        raise FileNotFoundError(name)
    return json.loads((Path(fixture_dir) / name).read_text(encoding="utf-8"))


def request_json(
    *,
    token: str,
    api_base_url: str,
    notion_version: str,
    fixture_dir: str | None,
    method: str,
    path: str,
    payload: dict | None = None,
    fixture_name: str | None = None,
) -> dict:
    if fixture_name and fixture_dir:
        return load_fixture(fixture_dir, fixture_name)
    return notion_request(token, api_base_url, notion_version, method, path, payload)


def rich_text_to_plain(items: list[dict]) -> str:
    return "".join(item.get("plain_text", "") for item in items)


def block_text(block: dict) -> str:
    block_type = block.get("type", "")
    payload = block.get(block_type, {})
    return rich_text_to_plain(payload.get("rich_text", []))


def block_to_markdown(block: dict) -> str:
    block_type = block.get("type", "")
    text = block_text(block)
    if block_type == "heading_1":
        return f"# {text}"
    if block_type == "heading_2":
        return f"## {text}"
    if block_type == "heading_3":
        return f"### {text}"
    if block_type == "paragraph":
        return text
    if block_type == "bulleted_list_item":
        return f"- {text}"
    if block_type == "numbered_list_item":
        return f"1. {text}"
    if block_type == "to_do":
        checked = block.get("to_do", {}).get("checked", False)
        return f"- [{'x' if checked else ' '}] {text}"
    if block_type == "quote":
        return f"> {text}"
    if block_type == "code":
        language = block.get("code", {}).get("language", "")
        return f"```{language}\n{text}\n```"
    return text


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "prompt"


def title_from_page(page: dict) -> str:
    props = page.get("properties", {})
    for value in props.values():
        if value.get("type") == "title":
            title = rich_text_to_plain(value.get("title", []))
            if title:
                return title
    return page.get("child_page", {}).get("title") or page.get("id", "untitled")


def order_from_page(page: dict, default_index: int) -> int:
    props = page.get("properties", {})
    preferred = ["order", "排序", "index", "no"]
    for key, value in props.items():
        if key.lower() in preferred and value.get("type") == "number" and value.get("number") is not None:
            return int(value["number"])
    for value in props.values():
        if value.get("type") == "number" and value.get("number") is not None:
            return int(value["number"])
    return default_index


def fetch_blocks(
    *,
    token: str,
    api_base_url: str,
    notion_version: str,
    fixture_dir: str | None,
    page_id: str,
) -> list[dict]:
    payload = request_json(
        token=token,
        api_base_url=api_base_url,
        notion_version=notion_version,
        fixture_dir=fixture_dir,
        method="GET",
        path=f"/blocks/{page_id}/children?page_size=100",
        fixture_name=f"blocks_{page_id}.json",
    )
    return payload.get("results", [])


def build_prompt_entry(page: dict, index: int, blocks: list[dict]) -> dict:
    title = title_from_page(page)
    order = order_from_page(page, index)
    body = "\n\n".join(filter(None, (block_to_markdown(block) for block in blocks))).strip()
    prompt_file = f"{order:02d}-{slugify(title)}.md"
    return {
        "id": page.get("id"),
        "title": title,
        "order": order,
        "prompt_file": prompt_file,
        "markdown": body,
    }


def fetch_prompts_from_database(
    *,
    token: str,
    api_base_url: str,
    notion_version: str,
    fixture_dir: str | None,
    database_id: str,
) -> list[dict]:
    payload = request_json(
        token=token,
        api_base_url=api_base_url,
        notion_version=notion_version,
        fixture_dir=fixture_dir,
        method="POST",
        path=f"/databases/{database_id}/query",
        payload={},
        fixture_name="database_query.json",
    )
    prompts = []
    for index, page in enumerate(payload.get("results", [])):
        blocks = fetch_blocks(
            token=token,
            api_base_url=api_base_url,
            notion_version=notion_version,
            fixture_dir=fixture_dir,
            page_id=page["id"],
        )
        prompts.append(build_prompt_entry(page, index, blocks))
    return sorted(prompts, key=lambda item: (item["order"], item["title"]))


def fetch_prompts_from_page(
    *,
    token: str,
    api_base_url: str,
    notion_version: str,
    fixture_dir: str | None,
    page_id: str,
) -> list[dict]:
    payload = request_json(
        token=token,
        api_base_url=api_base_url,
        notion_version=notion_version,
        fixture_dir=fixture_dir,
        method="GET",
        path=f"/blocks/{page_id}/children?page_size=100",
        fixture_name="page_children.json",
    )
    prompts = []
    for index, page in enumerate(payload.get("results", [])):
        child_id = page.get("id")
        blocks = fetch_blocks(
            token=token,
            api_base_url=api_base_url,
            notion_version=notion_version,
            fixture_dir=fixture_dir,
            page_id=child_id,
        )
        prompts.append(build_prompt_entry(page, index, blocks))
    return sorted(prompts, key=lambda item: (item["order"], item["title"]))


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
    fetch = sub.add_parser("fetch-prompts", help="Fetch prompts from a Notion database or page tree.")
    fetch.add_argument("--source-database-id")
    fetch.add_argument("--source-page-id")
    fetch.add_argument("--fixture-dir")

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
    elif args.command == "fetch-prompts":
        if not args.source_database_id and not args.source_page_id:
            raise SystemExit("fetch-prompts requires --source-database-id or --source-page-id")
        if args.source_database_id:
            payload = fetch_prompts_from_database(
                token=token,
                api_base_url=args.api_base_url,
                notion_version=args.notion_version,
                fixture_dir=args.fixture_dir,
                database_id=args.source_database_id,
            )
        else:
            payload = fetch_prompts_from_page(
                token=token,
                api_base_url=args.api_base_url,
                notion_version=args.notion_version,
                fixture_dir=args.fixture_dir,
                page_id=args.source_page_id,
            )
    else:
        raise SystemExit(f"Unknown command: {args.command}")

    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
