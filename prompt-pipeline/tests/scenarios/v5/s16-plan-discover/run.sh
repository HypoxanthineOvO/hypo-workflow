#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '\| `/hw:start` \|' SKILL.md
rg -q '\| `/hw:resume` \|' SKILL.md
rg -q '\| `/hw:status` \|' SKILL.md
rg -q '\| `/hw:skip` \|' SKILL.md
rg -q '\| `/hw:stop` \|' SKILL.md
rg -q '\| `/hw:report` \|' SKILL.md
rg -q '\| `/hw:plan` \|' SKILL.md
rg -q 'plan/PLAN-SKILL\.md' SKILL.md
rg -q '/hw:plan:discover' plan/PLAN-SKILL.md
rg -q 'Unknown command: /hw:plan:xxx' plan/PLAN-SKILL.md
rg -q '`开始执行` is the natural-language equivalent of `/hw:start`' references/commands-spec.md

echo "s16-plan-discover: PASS"
