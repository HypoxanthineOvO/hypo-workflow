#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

test -f core/package.json
test -x core/bin/hw-core
test -f core/src/index.js
test -f core/src/config/index.js
test -f core/src/profile/index.js
test -f core/src/platform/index.js
test -f core/src/commands/index.js
test -f core/src/rules/index.js
test -f core/src/artifacts/opencode.js

node --test core/test/*.test.js

node core/bin/hw-core commands --platform opencode > /tmp/hw-core-commands.json
grep -Fq '"canonical": "/hw:plan"' /tmp/hw-core-commands.json
grep -Fq '"opencode": "/hw-plan"' /tmp/hw-core-commands.json

node core/bin/hw-core rules --project . > /tmp/hw-core-rules.txt
grep -Fq 'Rules:' /tmp/hw-core-rules.txt
grep -Fq 'git-clean-check' /tmp/hw-core-rules.txt

bash scripts/rules-summary.sh . > /tmp/hw-shell-rules.txt
grep -Fq 'Rules:' /tmp/hw-shell-rules.txt

node core/bin/hw-core artifact opencode --out /tmp/hw-opencode-artifacts
test -f /tmp/hw-opencode-artifacts/.opencode/commands/hw-plan.md
test -f /tmp/hw-opencode-artifacts/.opencode/agents/hw-plan.md
test -f /tmp/hw-opencode-artifacts/opencode.json
test -f /tmp/hw-opencode-artifacts/.opencode/hypo-workflow.json
test -f /tmp/hw-opencode-artifacts/AGENTS.md
grep -Fq '/hw:plan' /tmp/hw-opencode-artifacts/.opencode/commands/hw-plan.md
grep -Fq 'todowrite' /tmp/hw-opencode-artifacts/.opencode/agents/hw-plan.md
grep -Fq '"compaction"' /tmp/hw-opencode-artifacts/opencode.json
grep -Fq '"auto_continue"' /tmp/hw-opencode-artifacts/.opencode/hypo-workflow.json

grep -Riq 'not a runner' core README.md references/v9-architecture.md

echo "s52 passed"
