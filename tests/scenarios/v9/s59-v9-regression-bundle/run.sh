#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

for scenario in \
  s51-opencode-capability-matrix \
  s52-core-config-artifacts \
  s53-global-cli-tui-setup \
  s54-opencode-plugin-scaffold \
  s55-opencode-command-map \
  s56-agents-ask-todo-plan-discipline \
  s57-opencode-events-auto-continue-file-guard \
  s58-opencode-full-v84-parity \
  s59-v9-regression-bundle
do
  test -f "tests/scenarios/v9/$scenario/run.sh" || {
    echo "missing V9 scenario $scenario" >&2
    exit 1
  }
  grep -Fq "\"$scenario\"" tests/run_regression.py || {
    echo "scenario not registered: $scenario" >&2
    exit 1
  }
done

if grep -R "curl .*opencode\\|OPENAI_API_KEY\\|https://api.openai.com\\|opencode run" tests/scenarios/v9/*.*/run.sh 2>/dev/null; then
  echo "V9 smoke tests must stay offline/static" >&2
  exit 1
fi

grep -Fq '当前预期回归数量为 `59/59`' README.md
grep -Fq 'OpenCode Native Adapter' README.md
grep -Fq 'references/opencode-parity.md' README.md

echo "s59 passed"
