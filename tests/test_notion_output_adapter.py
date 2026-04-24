#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts" / "notion_api.py"
REPORT = ROOT / "tests" / "fixtures" / "notion" / "report.md"


def run(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, text=True, capture_output=True, cwd=str(ROOT))


def main() -> int:
    rendered = run(
        [
            "python3",
            str(SCRIPT),
            "--token-file",
            "/home/heyx/Hypo-Workflow/Notion-API.md",
            "render-markdown",
            "--input-file",
            str(REPORT),
        ]
    )
    if rendered.returncode != 0:
        print(rendered.stderr)
        return 1
    blocks = json.loads(rendered.stdout)
    assert any(block["type"] == "heading_1" for block in blocks)
    assert any(block["type"] == "code" for block in blocks)

    dry = run(
        [
            "python3",
            str(SCRIPT),
            "--token-file",
            "/home/heyx/Hypo-Workflow/Notion-API.md",
            "upsert-report",
            "--report-file",
            str(REPORT),
            "--title",
            "Demo Report",
            "--output-parent-page-id",
            "parent-page-id",
            "--dry-run",
        ]
    )
    if dry.returncode != 0:
        print(dry.stderr)
        return 1
    payload = json.loads(dry.stdout)
    assert payload["mode"] == "create"
    assert payload["request"]["parent"]["page_id"] == "parent-page-id"
    assert payload["request"]["properties"]["title"]["title"][0]["text"]["content"] == "Demo Report"
    print("test_notion_output_adapter: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
