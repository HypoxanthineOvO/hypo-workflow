#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

node --test core/test/analysis-runtime.test.js core/test/analysis-state-ledger.test.js

test -f templates/analysis/report.md
test -f templates/analysis/ledger.yaml
test -f references/analysis-ledger-spec.md

! rg -n "gate: confirm" .pipeline/feature-queue.yaml >/dev/null
rg -n "default_gate: auto" .pipeline/feature-queue.yaml >/dev/null
rg -n "auto_chain: true" .pipeline/feature-queue.yaml >/dev/null
