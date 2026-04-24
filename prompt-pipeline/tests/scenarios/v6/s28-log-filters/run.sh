#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

rg -q -- '--all' references/log-spec.md
rg -q -- '--type <type>' references/log-spec.md
rg -q -- '--since <milestone>' references/log-spec.md
rg -q 'default: newest 10 entries' references/log-spec.md
test -f .pipeline/log.yaml

echo "s28-log-filters: PASS"
