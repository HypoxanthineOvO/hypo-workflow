#!/usr/bin/env python3
from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VALIDATE = ROOT / "scripts" / "validate-config.sh"
TOKEN_FILE = "/home/heyx/Hypo-Workflow/Notion-API.md"


def run_config(content: str) -> int:
    with tempfile.TemporaryDirectory(prefix="hw-notion-mixed-") as tmp:
        path = Path(tmp) / "config.yaml"
        path.write_text(content, encoding="utf-8")
        proc = subprocess.run(
            ["bash", str(VALIDATE), str(path)],
            cwd=str(ROOT),
            text=True,
            capture_output=True,
        )
        if proc.returncode != 0:
            print(proc.stdout + proc.stderr)
        return proc.returncode


def main() -> int:
    source_notion = f"""
pipeline:
  name: source-notion
  source: notion
  output: local
execution:
  mode: self
  steps:
    preset: tdd
evaluation:
  auto_continue: false
  max_diff_score: 3
notion:
  token_file: {TOKEN_FILE}
  source_page_id: page-id
"""
    output_notion = f"""
pipeline:
  name: output-notion
  source: local
  output: notion
execution:
  mode: self
  steps:
    preset: tdd
evaluation:
  auto_continue: false
  max_diff_score: 3
notion:
  token_file: {TOKEN_FILE}
  output_parent_page_id: parent-id
"""
    assert run_config(source_notion) == 0
    assert run_config(output_notion) == 0
    print("test_notion_mixed_mode: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
