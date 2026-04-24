#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

for step in '### Step 1: Preflight' '### Step 2: Regression' '### Step 3: Version Calculation' '### Step 4: File Updates' '### Step 5: Changelog' '### Step 6: Git Operations' '### Step 7: GitHub Release'; do
  rg -q "$step" references/release-spec.md
done
rg -q -- '--dry-run' references/release-spec.md
rg -q 'prints every planned step' references/release-spec.md

echo "s26-release-dry-run: PASS"
