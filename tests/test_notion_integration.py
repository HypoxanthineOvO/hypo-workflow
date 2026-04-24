#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "notion_api.py"
TOKEN_FILE = "/home/heyx/Hypo-Workflow/Notion-API.md"


def run(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, text=True, capture_output=True, cwd=str(ROOT))


def main() -> int:
    me = run(["python3", str(SCRIPT), "--token-file", TOKEN_FILE, "me"])
    if me.returncode != 0:
        print(me.stderr)
        return 1
    payload = json.loads(me.stdout)
    assert payload["type"] == "bot"
    assert payload["bot"]["workspace_name"] == "Hypoxanthine's Notion"

    search = run(["python3", str(SCRIPT), "--token-file", TOKEN_FILE, "search", "--query", "Hypo-Workflow"])
    if search.returncode != 0:
        print(search.stderr)
        return 1
    payload = json.loads(search.stdout)
    if payload.get("results"):
        print("test_notion_integration: PASS (search returned accessible pages)")
    else:
        print("test_notion_integration: PASS (auth works; no shared pages accessible, graceful degradation path active)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
