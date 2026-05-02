#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

showcase_dir=.pipeline/archives/C2-new-cycle/showcase
test -f "$showcase_dir/showcase.yaml"
test -f "$showcase_dir/PROJECT-INTRO.md"
test -f "$showcase_dir/TECHNICAL-DOC.md"
test -f "$showcase_dir/slides.md"
rg -q 'version: 1' "$showcase_dir/showcase.yaml"
rg -q 'Hypo-Workflow' "$showcase_dir/PROJECT-INTRO.md"
rg -q '31 个用户指令' "$showcase_dir/PROJECT-INTRO.md"
rg -q '```mermaid' "$showcase_dir/slides.md"
rg -q 'type: poster' "$showcase_dir/showcase.yaml"
rg -q 'OPENAI_API_KEY missing' "$showcase_dir/showcase.yaml"

echo "s49-showcase-bootstrap: PASS"
