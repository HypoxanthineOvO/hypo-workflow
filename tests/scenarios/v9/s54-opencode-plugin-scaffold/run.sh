#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

test -f plugins/opencode/templates/plugin.ts
test -f plugins/opencode/templates/AGENTS.md
test -f plugins/opencode/templates/package.json
test -f plugins/opencode/README.md

tmp_home="$(mktemp -d)"
tmp_project="$(mktemp -d)"

HOME="$tmp_home" node cli/bin/hypo-workflow init-project --platform opencode --project "$tmp_project"

test -f "$tmp_project/opencode.json"
test -f "$tmp_project/AGENTS.md"
test -f "$tmp_project/.opencode/package.json"
test -f "$tmp_project/.opencode/plugins/hypo-workflow.ts"
test -f "$tmp_project/.opencode/commands/hw-plan.md"
test -f "$tmp_project/.opencode/agents/hw-plan.md"

grep -Fq 'Hypo-Workflow managed' "$tmp_project/AGENTS.md"
grep -Fq 'version' "$tmp_project/.opencode/package.json"
grep -Fq 'commandMap' "$tmp_project/.opencode/plugins/hypo-workflow.ts"
grep -Fq '/hw:plan' "$tmp_project/.opencode/plugins/hypo-workflow.ts"
grep -Fq 'tool.execute.before' "$tmp_project/.opencode/plugins/hypo-workflow.ts"
grep -Fq 'session.idle' "$tmp_project/.opencode/plugins/hypo-workflow.ts"
grep -Fq 'does not implement business tasks' "$tmp_project/.opencode/plugins/hypo-workflow.ts"
grep -Fq '"experimental.session.compacting": true' "$tmp_project/opencode.json"

echo "s54 passed"
