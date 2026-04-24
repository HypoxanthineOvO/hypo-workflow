#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '| Empty project |' references/init-spec.md
rg -q 'generate `config.yaml` plus an empty architecture baseline' references/init-spec.md
rg -q '/hw:init' SKILL.md

echo "s22-init-empty-project: PASS"
