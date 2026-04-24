#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

for check in Config Pipeline State Prompts Notion Architecture; do
  rg -q "$check" references/check-spec.md
done
rg -q '✅' references/check-spec.md
rg -q '⚠️' references/check-spec.md
rg -q '❌' references/check-spec.md
rg -q 'Overall:' references/check-spec.md
rg -q 'Action:' references/check-spec.md

echo "s21-check-output: PASS"
