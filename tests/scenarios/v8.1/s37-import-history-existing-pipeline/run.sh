#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q 'If `.pipeline/state.yaml` already exists' skills/init/SKILL.md
rg -q 'import only commits before' skills/init/SKILL.md
rg -q 'C0 \[Legacy\]' skills/cycle/SKILL.md
rg -q '/hw:cycle view 0' skills/cycle/SKILL.md
rg -q 'cycle-0-legacy/summary.md' skills/plan-discover/SKILL.md

echo "s37-import-history-existing-pipeline: PASS"
