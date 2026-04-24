#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

count="$(awk '
  /^## Commands$/ {in_table=1; next}
  in_table && /^\| `\/hw:/ {c++}
  in_table && /^When the user types/ {print c; exit}
' SKILL.md)"

test "$count" = "20"
rg -q '20 canonical commands grouped under Pipeline, Plan, Lifecycle, and Utility' references/commands-spec.md
rg -q '^#### Pipeline$' README.md
rg -q '^#### Plan$' README.md
rg -q '^#### Lifecycle$' README.md
rg -q '^#### Utility$' README.md

echo "s19-help-list: PASS"
