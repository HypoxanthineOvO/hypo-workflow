#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q 'time_gap_threshold' config.schema.yaml
rg -q 'default: 24h' config.schema.yaml
rg -q 'Time gap: adjacent commits are separated by more than `history_import.time_gap_threshold`' skills/init/SKILL.md
rg -q 'time gaps larger than `history_import.time_gap_threshold`' references/init-spec.md

echo "s34-import-history-time-gap: PASS"
