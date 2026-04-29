#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

test -f skills/compact/SKILL.md
rg -q '/hw:compact' skills/compact/SKILL.md
rg -q 'PROGRESS.compact.md' skills/compact/SKILL.md
rg -q 'state.compact.yaml' skills/compact/SKILL.md
rg -q 'log.compact.yaml' skills/compact/SKILL.md
rg -q 'reports.compact.md' skills/compact/SKILL.md
rg -q 'patches.compact.md' skills/compact/SKILL.md
rg -q 'progress_recent' config.schema.yaml
rg -q 'state_history_full' config.schema.yaml
rg -q 'reports_summary_lines' config.schema.yaml
rg -q '\\*.compact.\\*' .gitignore

echo "s39-compact-generator: PASS"
