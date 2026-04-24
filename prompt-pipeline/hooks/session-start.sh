#!/bin/bash
# Pipeline SessionStart Hook — additionalContext 注入
#
# 触发时机：Claude Code 的 SessionStart 事件（startup / resume / clear / compact）

set -euo pipefail

matcher="${1:-startup}"
script_dir="$(cd "$(dirname "$0")" && pwd)"
scripts_dir="$script_dir/../scripts"
payload="$(cat || true)"

json_escape() {
  local value="${1-}"
  value=${value//\\/\\\\}
  value=${value//\"/\\\"}
  value=${value//$'\n'/\\n}
  value=${value//$'\r'/}
  value=${value//$'\t'/\\t}
  printf '%s' "$value"
}

emit_empty() {
  printf '{}\n'
}

extract_json_string() {
  local key="$1"
  printf '%s' "$payload" | tr '\n' ' ' | sed -n "s/.*\"${key}\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" | head -n1
}

cwd="$(extract_json_string cwd)"
if [[ -z "$cwd" ]]; then
  cwd="$(pwd)"
fi

pipeline_dir="$cwd/.pipeline"
state_file="$pipeline_dir/state.yaml"

if [[ ! -f "$state_file" ]]; then
  emit_empty
  exit 0
fi

summary="$("$scripts_dir/state-summary.sh" "$pipeline_dir" 2>/dev/null || true)"
if [[ -z "$summary" || "$summary" == "No active pipeline" ]]; then
  emit_empty
  exit 0
fi

pipeline_name="$(printf '%s\n' "$summary" | sed -n 's/^Pipeline: //p' | head -n1)"
pipeline_status="$(printf '%s\n' "$summary" | sed -n 's/^Status: //p' | head -n1)"
current_line="$(printf '%s\n' "$summary" | sed -n 's/^Current: //p' | head -n1)"
last_line="$(printf '%s\n' "$summary" | sed -n 's/^Last completed: //p' | head -n1)"

current_prompt="$(printf '%s\n' "$current_line" | sed -n 's#^\(.*\) / .* (step_index: .*#\1#p' | head -n1)"
current_step="$(printf '%s\n' "$current_line" | sed -n 's#^.* / \(.*\) (step_index: .*#\1#p' | head -n1)"
current_step_index="$(printf '%s\n' "$current_line" | sed -n 's#^.*(step_index: \(.*\))#\1#p' | head -n1)"

case "$matcher" in
  startup|clear)
    additional_context="[Hypo-Workflow Pipeline 状态]
Pipeline: ${pipeline_name}
Status: ${pipeline_status}
当前 Prompt: ${current_prompt}
当前步骤: ${current_step} (step_index: ${current_step_index})
上次完成: ${last_line}

请按照 SKILL.md 的流程从当前步骤继续执行。"
    ;;
  resume)
    additional_context="[会话恢复 — Hypo-Workflow Pipeline]
上次执行到: ${current_step} (prompt: ${current_prompt})
Pipeline 状态: ${pipeline_status}

请从中断处继续。如果当前步骤已完成，进入下一步。"
    ;;
  compact)
    additional_context="[⚠️ 上下文已压缩 — Pipeline 状态重新注入]
Pipeline: ${pipeline_name}
Status: ${pipeline_status}
当前 Prompt: ${current_prompt}
当前步骤: ${current_step} (step_index: ${current_step_index})
上次完成: ${last_line}

注意：上下文刚刚被压缩，之前的详细执行信息可能已丢失。
请以 state.yaml 和 log.md 为准，继续当前步骤。"
    ;;
  *)
    additional_context="[Hypo-Workflow Pipeline 状态]
Pipeline: ${pipeline_name}
Status: ${pipeline_status}
当前 Prompt: ${current_prompt}
当前步骤: ${current_step} (step_index: ${current_step_index})"
    ;;
esac

system_message="🔄 Pipeline: ${pipeline_name} | Step: ${current_step}"

printf '{"systemMessage":"%s","additionalContext":"%s"}\n' \
  "$(json_escape "$system_message")" \
  "$(json_escape "$additional_context")"
