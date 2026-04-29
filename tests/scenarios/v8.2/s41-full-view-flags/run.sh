#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '/hw:status --full' skills/status/SKILL.md
rg -q '加载完整版 state.yaml' skills/status/SKILL.md
rg -q '/hw:log --full' skills/log/SKILL.md
rg -q '加载完整版 log.yaml' skills/log/SKILL.md
rg -q '/hw:report --view M3' skills/report/SKILL.md
rg -q 'reports.compact.md' skills/report/SKILL.md
rg -q -- '--view M<N>' references/commands-spec.md

echo "s41-full-view-flags: PASS"
