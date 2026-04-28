#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q 'git rev-parse --is-inside-work-tree' skills/init/SKILL.md
rg -q '❌ 当前目录不是 git 仓库，请先执行 git init' skills/init/SKILL.md
rg -q 'non-Git repos stop' references/init-spec.md

echo "s36-import-history-non-git: PASS"
