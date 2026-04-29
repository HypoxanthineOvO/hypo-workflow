#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '/hw:patch fix P001' skills/patch/SKILL.md
rg -q 'Patch Fix 执行约束' skills/patch/SKILL.md
rg -q 'Step 1: 读取 Patch' README.md
rg -Fq 'fix(P<NNN>): <描述>' skills/patch/SKILL.md
rg -q 'Patch fix must never write `.pipeline/state.yaml`' skills/patch/SKILL.md
rg -q 'type: patch_fix' skills/patch/SKILL.md
rg -Fq '/hw:patch fix P{NNN} [P{NNN} ...]' references/commands-spec.md

echo "s38-patch-fix-flow: PASS"
