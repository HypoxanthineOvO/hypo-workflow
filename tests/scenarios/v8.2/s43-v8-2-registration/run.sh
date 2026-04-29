#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q 'version: 8.2.0' SKILL.md
rg -q '查看全部 28 个用户指令' SKILL.md
rg -q '\| `/hw:compact` \|' SKILL.md
rg -q '\| `/hw:guide` \|' SKILL.md
rg -q 'Patch Fix' README.md
rg -q 'Context Compact' README.md
rg -q 'Interactive Guide' README.md
rg -q '### v8.2.0' README.md
rg -q '"version": "8.2.0"' .claude-plugin/plugin.json

echo "s43-v8-2-registration: PASS"
