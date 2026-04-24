#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '### `/hw:reset`' references/commands-spec.md
rg -q -- '--full' references/commands-spec.md
rg -q -- '--hard' references/commands-spec.md
rg -q '`YES`' references/commands-spec.md
rg -q '/hw:reset' SKILL.md

echo "s27-reset-modes: PASS"
