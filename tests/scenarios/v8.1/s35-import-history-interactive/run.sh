#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q -- '--interactive' skills/init/SKILL.md
rg -q 'Stop and wait for user confirmation' skills/init/SKILL.md
rg -q 'merge, split, rename, or switch signal' skills/init/SKILL.md
rg -q -- '--import-history --interactive' references/commands-spec.md
rg -q 'Support `--rescan`, `--folder`, `--single`, `--import-history`, and `--import-history --interactive`' SKILL.md
rg -q 'with `--import-history --interactive`, show the proposed split and wait for explicit user confirmation' references/commands-spec.md

echo "s35-import-history-interactive: PASS"
