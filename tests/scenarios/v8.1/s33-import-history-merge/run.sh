#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q 'git log --merges --first-parent' skills/init/SKILL.md
rg -q 'Merge milestones are named like `M0-pr-1`' skills/init/SKILL.md
rg -q 'merge commits from `git log --merges --first-parent`' references/init-spec.md

echo "s33-import-history-merge: PASS"
