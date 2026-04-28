#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

test -f templates/legacy-report.md
rg -q -- '--import-history' skills/init/SKILL.md
rg -q 'git tag --sort=creatordate' skills/init/SKILL.md
rg -q 'M0-v1.0' skills/init/SKILL.md
rg -q 'cycle-0-legacy' skills/init/SKILL.md
rg -q 'import_method: <tag \\| keyword \\| merge \\| time_gap>' skills/init/SKILL.md

echo "s31-import-history-tags: PASS"
