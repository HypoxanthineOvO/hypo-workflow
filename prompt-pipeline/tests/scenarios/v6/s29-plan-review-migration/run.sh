#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '/hw:plan:review' SKILL.md
rg -q '/hw:plan:review' plan/PLAN-SKILL.md
rg -q '/hw:plan:review' references/plan-review-spec.md
rg -q '/hw:plan:review' references/commands-spec.md
rg -q '已迁移到' SKILL.md
rg -q '已迁移到' plan/PLAN-SKILL.md
rg -q '已迁移到' references/plan-review-spec.md
rg -q '/hw:review --full' plan/PLAN-SKILL.md

echo "s29-plan-review-migration: PASS"
