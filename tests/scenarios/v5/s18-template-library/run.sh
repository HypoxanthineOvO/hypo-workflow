#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

test -f references/plan-review-spec.md
rg -q '/hw:review --full' references/plan-review-spec.md
rg -q '/hw:review --full' plan/PLAN-SKILL.md
test -f plan/assets/prompt-patch-queue-template.yaml
rg -q 'prompt-patch-queue\.yaml' references/plan-review-spec.md
rg -q '## Review History' .pipeline/archives/C2-new-cycle/architecture-snapshot.md

for template in tdd-python-cli tdd-typescript-web docs-writing research refactor; do
  test -f "plan/templates/$template/config.yaml"
  count="$(find "plan/templates/$template/prompts" -maxdepth 1 -name '*.md' | wc -l | tr -d ' ')"
  test "$count" -ge 3
done

echo "s18-template-library: PASS"
