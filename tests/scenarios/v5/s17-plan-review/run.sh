#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

test -f plan/assets/design-spec-template.md
test -f plan/assets/prompt-template.md
rg -q '### Discover' plan/PLAN-SKILL.md
rg -q '### Decompose' plan/PLAN-SKILL.md
rg -q '### Generate' plan/PLAN-SKILL.md
rg -q '### Confirm' plan/PLAN-SKILL.md
rg -q 'append mode' plan/PLAN-SKILL.md
rg -q 'Append conflict rules' plan/PLAN-SKILL.md
rg -q '\.plan-state/' .gitignore
test -f .pipeline/design-spec.md

echo "s17-plan-review: PASS"
