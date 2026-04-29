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

test "$count" = "29"
rg -q '29 user-facing commands grouped under Setup, Pipeline, Plan, Lifecycle, and Utility' references/commands-spec.md
rg -q '\| `/hw:cycle` \|' SKILL.md
rg -q '\| `/hw:patch` \|' SKILL.md
rg -q '\| `/hw:compact` \|' SKILL.md
rg -q '\| `/hw:guide` \|' SKILL.md
rg -q '\| `/hw:showcase` \|' SKILL.md
rg -q '\| `/hw:plan:extend` \|' SKILL.md
rg -q '^#### Setup$' README.md
rg -q '^#### Pipeline$' README.md
rg -q '^#### Plan$' README.md
rg -q '^#### Lifecycle$' README.md
rg -q '^#### Utility$' README.md

echo "s19-help-list: PASS"
