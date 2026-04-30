#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

tmp_project="$(mktemp -d)"
node cli/bin/hypo-workflow init-project --platform opencode --project "$tmp_project" >/tmp/hw-s55-init.log

count="$(find "$tmp_project/.opencode/commands" -maxdepth 1 -type f -name 'hw-*.md' | wc -l | tr -d ' ')"
test "$count" = "30" || {
  echo "expected 30 command files, found $count" >&2
  exit 1
}

grep -Fq 'agent: hw-plan' "$tmp_project/.opencode/commands/hw-plan.md"
grep -Fq 'agent: hw-plan' "$tmp_project/.opencode/commands/hw-plan-discover.md"
grep -Fq 'agent: hw-plan' "$tmp_project/.opencode/commands/hw-plan-confirm.md"
grep -Fq 'agent: hw-build' "$tmp_project/.opencode/commands/hw-start.md"
grep -Fq 'agent: hw-build' "$tmp_project/.opencode/commands/hw-resume.md"
grep -Fq 'agent: hw-build' "$tmp_project/.opencode/commands/hw-patch-fix.md"
grep -Fq 'agent: hw-build' "$tmp_project/.opencode/commands/hw-release.md"
grep -Fq 'agent: hw-review' "$tmp_project/.opencode/commands/hw-audit.md"
grep -Fq 'agent: hw-status' "$tmp_project/.opencode/commands/hw-status.md"

for pair in \
  "hw-plan.md:/hw:plan" \
  "hw-plan-discover.md:/hw:plan:discover" \
  "hw-patch-fix.md:/hw:patch fix" \
  "hw-dashboard.md:/hw:dashboard"
do
  file="${pair%%:*}"
  command="${pair#*:}"
  grep -Fq "$command" "$tmp_project/.opencode/commands/$file" || {
    echo "$file missing canonical $command" >&2
    exit 1
  }
done

grep -Fq 'Load the corresponding Hypo-Workflow skill instructions' "$tmp_project/.opencode/commands/hw-plan.md"
grep -Fq '.pipeline/state.yaml' "$tmp_project/.opencode/commands/hw-start.md"
grep -Fq '.pipeline/rules.yaml' "$tmp_project/.opencode/commands/hw-rules.md"

test -f references/opencode-command-map.md
grep -Fq '| `/hw:plan` | `/hw-plan` | `hw-plan` |' references/opencode-command-map.md
grep -Fq '| `/hw:patch fix` | `/hw-patch-fix` | `hw-build` |' references/opencode-command-map.md

echo "s55 passed"
