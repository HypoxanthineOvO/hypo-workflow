#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

node --test core/test/analysis-runtime.test.js core/test/analysis-state-ledger.test.js

test -f templates/analysis/report.md
test -f templates/analysis/ledger.yaml
test -f references/analysis-ledger-spec.md

queue=".pipeline/archives/C3-opencode-multi-agent-matrix-and-v10-analysis-preset/feature-queue.yaml"

! rg -n "gate: confirm" "$queue" >/dev/null
rg -n "default_gate: auto" "$queue" >/dev/null
rg -n "auto_chain: true" "$queue" >/dev/null
