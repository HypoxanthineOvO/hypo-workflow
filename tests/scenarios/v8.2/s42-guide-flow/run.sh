#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

test -f skills/guide/SKILL.md
rg -q '/hw:guide' skills/guide/SKILL.md
rg -q 'at most 5 lines' skills/guide/SKILL.md
rg -q '你现在想做什么？' skills/guide/SKILL.md
rg -q 'Start a new project from zero' skills/guide/SKILL.md
rg -q '/hw:init --import-history' skills/guide/SKILL.md
rg -q '/hw:compact' skills/guide/SKILL.md
rg -q '要我帮你开始吗？' skills/guide/SKILL.md
rg -q 'execute the first command' skills/guide/SKILL.md

echo "s42-guide-flow: PASS"
