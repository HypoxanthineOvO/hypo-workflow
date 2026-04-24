#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '### `/hw:help`' references/commands-spec.md
rg -q '/hw:help <cmd>' references/commands-spec.md
rg -q '### `/hw:init`' references/commands-spec.md
rg -q -- '--rescan' references/commands-spec.md
rg -q -- '--folder' references/commands-spec.md
rg -q -- '--single' references/commands-spec.md

echo "s20-help-init: PASS"
