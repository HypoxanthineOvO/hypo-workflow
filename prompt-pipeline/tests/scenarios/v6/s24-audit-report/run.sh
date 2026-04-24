#!/bin/bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/../../../.." && pwd)"

cd "$repo_root"

for code in SEC BUG ARCH PERF TEST QUAL; do
  rg -q "$code" references/audit-spec.md
done
rg -q 'Critical \(must fix\)' references/audit-spec.md
rg -q 'Warning \(should fix\)' references/audit-spec.md
rg -q 'Info \(nice to have\)' references/audit-spec.md
rg -q '\.pipeline/audits/audit-NNN\.md' references/audit-spec.md

echo "s24-audit-report: PASS"
