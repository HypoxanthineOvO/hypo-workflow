#!/bin/bash
set -euo pipefail

tmp_home="$(mktemp -d)"
tmp_project="$(mktemp -d)"
repo_root="$(cd "$(dirname "$0")/../../../.." && pwd)"

HOME="$tmp_home" node "$repo_root/cli/bin/hypo-workflow" init-project --platform opencode --project "$tmp_project" --automation full >/tmp/hw-s63-init.log

test -f "$tmp_project/.pipeline/config.yaml"
test ! -d "$tmp_project/.git"
grep -Fq 'automation:' "$tmp_project/.pipeline/config.yaml"
grep -Fq '  level: full' "$tmp_project/.pipeline/config.yaml"
! grep -Fq 'levels:' "$tmp_project/.pipeline/config.yaml"
bash "$repo_root/scripts/validate-config.sh" "$tmp_project/.pipeline/config.yaml"

bad_config="$tmp_project/.pipeline/bad-config.yaml"
cp "$tmp_project/.pipeline/config.yaml" "$bad_config"
perl -0pi -e 's/level: full/level: reckless/' "$bad_config"
if bash "$repo_root/scripts/validate-config.sh" "$bad_config" >/tmp/hw-s63-bad.log 2>&1; then
  echo "expected invalid automation level to fail"
  exit 1
fi
grep -Fq 'automation.level must be one of: manual, balanced, full' /tmp/hw-s63-bad.log

echo "s63-init-automation-non-git: PASS"
