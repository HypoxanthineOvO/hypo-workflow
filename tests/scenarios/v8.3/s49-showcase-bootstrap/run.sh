#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

test -f .pipeline/showcase/showcase.yaml
test -f .pipeline/showcase/PROJECT-INTRO.md
test -f .pipeline/showcase/TECHNICAL-DOC.md
test -f .pipeline/showcase/slides.md
rg -q 'version: 1' .pipeline/showcase/showcase.yaml
rg -q 'Hypo-Workflow' .pipeline/showcase/PROJECT-INTRO.md
rg -q '31 个用户指令' .pipeline/showcase/PROJECT-INTRO.md
rg -q '```mermaid' .pipeline/showcase/slides.md
rg -q 'type: poster' .pipeline/showcase/showcase.yaml
rg -q 'OPENAI_API_KEY missing' .pipeline/showcase/showcase.yaml

echo "s49-showcase-bootstrap: PASS"
