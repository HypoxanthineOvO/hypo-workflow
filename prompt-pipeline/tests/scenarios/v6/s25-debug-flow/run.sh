#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '## Difference From Audit' references/debug-spec.md
for step in '### Step 1: Collect Symptoms' '### Step 2: Gather Context' '### Step 3: Generate Hypotheses' '### Step 4: Validate' '### Step 5: Report Root Cause'; do
  rg -q "$step" references/debug-spec.md
done
rg -q -- '--auto-fix' references/debug-spec.md
rg -q '\.pipeline/debug/' references/debug-spec.md

echo "s25-debug-flow: PASS"
