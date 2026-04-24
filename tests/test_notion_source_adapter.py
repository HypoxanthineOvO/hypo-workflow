#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "tests" / "fixtures" / "notion"
SCRIPT = ROOT / "scripts" / "notion_api.py"


def run(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, text=True, capture_output=True, cwd=str(ROOT))


def main() -> int:
    db = run(
        [
            "python3",
            str(SCRIPT),
            "--token-file",
            "/home/heyx/Hypo-Workflow/Notion-API.md",
            "fetch-prompts",
            "--fixture-dir",
            str(FIXTURES),
            "--source-database-id",
            "db-id",
        ]
    )
    if db.returncode != 0:
        print(db.stderr)
        return 1
    payload = json.loads(db.stdout)
    assert payload[0]["prompt_file"] == "00-scaffold.md"
    assert payload[1]["prompt_file"] == "02-core-feature.md"

    page = run(
        [
            "python3",
            str(SCRIPT),
            "--token-file",
            "/home/heyx/Hypo-Workflow/Notion-API.md",
            "fetch-prompts",
            "--fixture-dir",
            str(FIXTURES),
            "--source-page-id",
            "page-id",
        ]
    )
    if page.returncode != 0:
        print(page.stderr)
        return 1
    payload = json.loads(page.stdout)
    assert payload[0]["title"] == "Scaffold"
    assert "Create the scaffold page" in payload[0]["markdown"]
    assert payload[1]["prompt_file"] == "02-polish.md"
    print("test_notion_source_adapter: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
