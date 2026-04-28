#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q -- '--interactive' skills/init/SKILL.md
rg -q 'Stop and wait for user confirmation' skills/init/SKILL.md
rg -q 'merge, split, rename, or switch signal' skills/init/SKILL.md
rg -q -- '--import-history --interactive' references/commands-spec.md
rg -q '/hw:init --import-history --interactive' README.md

echo "s35-import-history-interactive: PASS"
