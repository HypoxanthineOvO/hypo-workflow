#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q 'Keep unselected artifacts unchanged' skills/showcase/SKILL.md
rg -q 'history/v{N}' skills/showcase/SKILL.md
rg -q 'version: 3' skills/showcase/SKILL.md
rg -q 'completeness: selected artifacts exist' skills/showcase/SKILL.md
rg -q 'accuracy: data matches the analyze summary' skills/showcase/SKILL.md
rg -q '/hw:showcase --all' skills/showcase/SKILL.md
rg -q 'artifacts generated, review' skills/showcase/SKILL.md

echo "s47-showcase-lifecycle: PASS"
