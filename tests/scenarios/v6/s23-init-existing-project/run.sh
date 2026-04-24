#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q '### Phase 1: Environment Sensing' references/init-spec.md
rg -q '### Phase 2: Structure Scan' references/init-spec.md
rg -q '### Phase 3: Deep Reading' references/init-spec.md
rg -q '### Phase 4: Outputs' references/init-spec.md

echo "s23-init-existing-project: PASS"
