#!/bin/bash
# Pipeline InstructionsLoaded Hook — CLAUDE.md 加载监听
#
# 触发时机：Claude Code 的 InstructionsLoaded 事件
# matcher: "session_start|path_glob_match|nested_traversal"

set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
scripts_dir="$script_dir/../scripts"
payload="$(cat || true)"

extract_json_string() {
  local key="$1"
  printf '%s' "$payload" | tr '\n' ' ' | sed -n "s/.*\"${key}\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" | head -n1
}

cwd="$(extract_json_string cwd)"
if [[ -z "$cwd" ]]; then
  cwd="$(pwd)"
fi

pipeline_dir="$cwd/.pipeline"
if [[ ! -d "$pipeline_dir" ]]; then
  exit 0
fi

file_path="$(extract_json_string file_path)"
load_reason="$(extract_json_string load_reason)"

if [[ "$file_path" == *"SKILL.md"* ]]; then
  (
    bash "$scripts_dir/log-append.sh" \
      --pipeline-dir "$pipeline_dir" \
      --step "hook:instructions-loaded" \
      --status "done" \
      --message "load_reason=${load_reason:-unknown}; file_path=${file_path:-unknown}"
  ) >/dev/null 2>&1 &
fi

exit 0
