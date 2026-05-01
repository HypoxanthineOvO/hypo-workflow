#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$ROOT"

for file in \
  references/opencode-spec.md \
  references/platform-capabilities.md \
  references/v9-architecture.md
do
  test -f "$file" || {
    echo "missing required spec file: $file" >&2
    exit 1
  }
done

for term in native plugin-assisted agent-prompt HW-specific; do
  grep -Fq "$term" references/opencode-spec.md || {
    echo "opencode-spec.md missing classification: $term" >&2
    exit 1
  }
done

for url in \
  "https://opencode.ai/docs/plugins/" \
  "https://opencode.ai/docs/commands/" \
  "https://opencode.ai/docs/agents/" \
  "https://opencode.ai/docs/tools/" \
  "https://opencode.ai/docs/permissions" \
  "https://opencode.ai/docs/rules"
do
  grep -Fq "$url" references/opencode-spec.md || {
    echo "opencode-spec.md missing official doc URL: $url" >&2
    exit 1
  }
done

mapping_count="$(
  awk '
    /^## Canonical Command Mapping/ { inside=1; next }
    inside && /^## / { print count; found=1; exit }
    inside && /^\| `\/hw/ { count++ }
    END { if (inside && !found) print count }
  ' references/opencode-spec.md
)"

test "$mapping_count" = "31" || {
  echo "expected 31 OpenCode command mappings, found $mapping_count" >&2
  exit 1
}

for cmd in \
  "/hw:start" "/hw:resume" "/hw:status" "/hw:skip" "/hw:stop" "/hw:report" "/hw:chat" \
  "/hw:plan" "/hw:plan:discover" "/hw:plan:decompose" "/hw:plan:generate" \
  "/hw:plan:confirm" "/hw:plan:extend" "/hw:plan:review" "/hw:cycle" \
  "/hw:patch" "/hw:patch fix" "/hw:compact" "/hw:guide" "/hw:showcase" \
  "/hw:rules" "/hw:init" "/hw:check" "/hw:audit" "/hw:release" "/hw:debug" \
  "/hw:help" "/hw:reset" "/hw:log" "/hw:setup" "/hw:dashboard"
do
  grep -Fq "| \`$cmd\` |" references/opencode-spec.md || {
    echo "missing command mapping for $cmd" >&2
    exit 1
  }
done

for platform in "Codex" "Claude Code" "OpenCode"; do
  grep -Fq "$platform" references/platform-capabilities.md || {
    echo "platform-capabilities.md missing platform: $platform" >&2
    exit 1
  }
done

grep -Fq "No degradation" references/platform-capabilities.md || {
  echo "platform-capabilities.md missing No degradation commitment" >&2
  exit 1
}

for term in "not a runner" "hypo-workflow" "plugins/opencode" "core/"; do
  grep -Fq "$term" references/v9-architecture.md || {
    echo "v9-architecture.md missing architecture term: $term" >&2
    exit 1
  }
done

grep -Fq "OpenCode Native Adapter" README.md || {
  echo "README.md missing V9 OpenCode reference" >&2
  exit 1
}

echo "s51 passed"
