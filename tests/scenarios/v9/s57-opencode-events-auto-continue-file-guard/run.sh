#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

tmp_project="$(mktemp -d)"
node cli/bin/hypo-workflow init-project --platform opencode --project "$tmp_project" >/tmp/hw-s57-init.log
plugin="$tmp_project/.opencode/plugins/hypo-workflow.ts"
config="$tmp_project/opencode.json"

grep -Fq 'auto_continue' "$config"
grep -Fq '"enabled": true' "$config"
grep -Fq '"mode": "safe"' "$config"

for event in \
  'command.executed' \
  'tool.execute.before' \
  'tool.execute.after' \
  'session.idle' \
  'session.compacted' \
  'permission.asked' \
  'permission.replied'
do
  grep -Fq "$event" "$plugin" || {
    echo "missing event $event" >&2
    exit 1
  }
done

grep -Fq 'recordCommandContext' "$plugin"
grep -Fq 'shouldAutoContinue' "$plugin"
grep -Fq 'mode === "safe"' "$plugin"
grep -Fq 'mode === "ask"' "$plugin"
grep -Fq 'mode === "aggressive"' "$plugin"
grep -Fq 'restoreCompactContext' "$plugin"
grep -Fq '.pipeline/state.yaml' "$plugin"
grep -Fq '.pipeline/PROGRESS' "$plugin"
grep -Fq '.pipeline/cycle.yaml' "$plugin"
grep -Fq '.pipeline/rules.yaml' "$plugin"
grep -Fq '.pipeline/patches' "$plugin"
grep -Fq 'behavior: "deny"' "$plugin"
grep -Fq 'severity: "warn"' "$plugin"
grep -Fq 'recordPermissionEvent' "$plugin"

echo "s57 passed"
