#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

for file in report.md evaluation-criteria.md legacy-report.md; do
  test -f "templates/en/$file"
  test -f "templates/zh/$file"
done
for file in step-write-tests.md step-review-tests.md step-implement.md step-run-tests.md step-review-code.md; do
  test -f "templates/en/tdd/$file"
  test -f "templates/zh/tdd/$file"
done
rg -q 'templates/zh/' SKILL.md
rg -q 'templates/en/' SKILL.md
rg -q 'PROJECT-SUMMARY.md.*output.language' skills/cycle/SKILL.md
rg -q '📌 输出语言规则' skills/showcase/SKILL.md
rg -q 'templates/zh/legacy-report.md' skills/init/SKILL.md

echo "s48-i18n-templates: PASS"
