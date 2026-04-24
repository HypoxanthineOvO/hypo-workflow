#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q -- '--rescan' references/init-spec.md
rg -q 'diffs against the current architecture baseline' references/init-spec.md
rg -q '/hw:init --rescan' SKILL.md

echo "s30-init-rescan: PASS"
