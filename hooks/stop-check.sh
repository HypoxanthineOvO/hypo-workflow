#!/bin/bash
# Pipeline Stop Hook — decision:block 强制完成
#
# 触发时机：Claude Code 的 Stop 事件（Agent 每次尝试停止前）
#
# 输入：stdin 接收 Claude Code 传入的 JSON（包含 session_id, cwd 等）

set -euo pipefail

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

emit_block() {
  local reason="$1"
  printf '{"decision":"block","reason":"%s"}\n' "$(json_escape "$reason")"
}

extract_json_string() {
  local key="$1"
  printf '%s' "$payload" | tr '\n' ' ' | sed -n "s/.*\"${key}\"[[:space:]]*:[[:space:]]*\"\\([^\"]*\\)\".*/\\1/p" | head -n1
}

trim() {
  sed -E 's/^[[:space:]"]+//; s/[[:space:]"]+$//'
}

extract_section() {
  local file="$1"
  local section="$2"
  local key="$3"
  awk -v section="$section" -v key="$key" '
    $0 ~ "^" section ":" { in_section=1; next }
    in_section && $0 ~ "^[^[:space:]]" { in_section=0 }
    in_section && match($0, "^[[:space:]]*" key ":[[:space:]]*(.*)$", m) {
      print m[1]
      exit
    }
  ' "$file" | trim
}

extract_state_current() {
  local file="$1"
  local key="$2"
  awk -v key="$key" '
    /^current:/ { in_section=1; next }
    in_section && /^[^[:space:]]/ { in_section=0 }
    in_section && match($0, "^[[:space:]]*" key ":[[:space:]]*(.*)$", m) {
      print m[1]
      exit
    }
  ' "$file" | trim
}

count_unfinished_milestones() {
  local file="$1"
  awk '
    /^milestones:/ { in_ms=1; next }
    in_ms && /^[^[:space:]]/ { in_ms=0 }
    in_ms && match($0, /^[[:space:]]*status:[[:space:]]*(.*)$/, m) {
      status=m[1]
      gsub(/^[[:space:]"]+|[[:space:]"]+$/, "", status)
      if (status != "done" && status != "skipped") count++
    }
    END { print count + 0 }
  ' "$file"
}

file_mtime() {
  local file="$1"
  if stat -c %Y "$file" >/dev/null 2>&1; then
    stat -c %Y "$file"
  else
    stat -f %m "$file"
  fi
}

cwd="$(extract_json_string cwd)"
if [[ -z "$cwd" ]]; then
  cwd="$(pwd)"
fi

pipeline_dir="$cwd/.pipeline"
config_file="$pipeline_dir/config.yaml"

if [[ ! -d "$pipeline_dir" ]]; then
  emit_empty
  exit 0
fi

state_file="$pipeline_dir/state.yaml"
log_file="$pipeline_dir/log.md"
reports_dir="$pipeline_dir/reports"

if [[ -f "$config_file" ]]; then
  state_path="$(extract_section "$config_file" pipeline state_file)"
  log_path="$(extract_section "$config_file" pipeline log_file)"
  reports_path="$(extract_section "$config_file" pipeline reports_dir)"

  if [[ -n "$state_path" ]]; then
    if [[ "$state_path" = /* ]]; then
      state_file="$state_path"
    else
      state_file="$cwd/$state_path"
    fi
  fi

  if [[ -n "$log_path" ]]; then
    if [[ "$log_path" = /* ]]; then
      log_file="$log_path"
    else
      log_file="$cwd/$log_path"
    fi
  fi

  if [[ -n "$reports_path" ]]; then
    if [[ "$reports_path" = /* ]]; then
      reports_dir="$reports_path"
    else
      reports_dir="$cwd/$reports_path"
    fi
  fi
fi

if [[ ! -f "$state_file" ]]; then
  emit_empty
  exit 0
fi

summary="$("$scripts_dir/state-summary.sh" "$(dirname "$state_file")" 2>/dev/null || true)"
if [[ -z "$summary" || "$summary" == "No active pipeline" ]]; then
  emit_empty
  exit 0
fi

pipeline_status="$(printf '%s\n' "$summary" | sed -n 's/^Status: //p' | head -n1)"
if [[ "$pipeline_status" != "running" ]]; then
  emit_empty
  exit 0
fi

phase="$(extract_state_current "$state_file" phase)"
plan_mode="interactive"
if [[ -f "$config_file" ]]; then
  detected_plan_mode="$(extract_section "$config_file" plan mode)"
  if [[ -n "$detected_plan_mode" ]]; then
    plan_mode="$detected_plan_mode"
  fi
fi

if [[ "$phase" == plan_* && "$plan_mode" == "interactive" ]]; then
  emit_empty
  exit 0
fi

if [[ "$phase" == lifecycle_* || "$phase" == "completed" ]]; then
  emit_empty
  exit 0
fi

if [[ "$phase" == "executing" ]]; then
  unfinished_milestones="$(count_unfinished_milestones "$state_file")"
  if [[ "$unfinished_milestones" == "0" ]]; then
    emit_empty
    exit 0
  fi
fi

now_epoch="$(date +%s)"
state_mtime="$(file_mtime "$state_file")"
if (( now_epoch - state_mtime > 60 )); then
  emit_block "请先更新 .pipeline/state.yaml 中当前步骤的状态，然后再次尝试完成。"
  exit 0
fi

if [[ ! -f "$log_file" ]]; then
  emit_block "请先在 .pipeline/log.md 中记录当前步骤的结果，然后再次尝试完成。"
  exit 0
fi

log_mtime="$(file_mtime "$log_file")"
if (( now_epoch - log_mtime > 60 )); then
  emit_block "请先在 .pipeline/log.md 中记录当前步骤的结果，然后再次尝试完成。"
  exit 0
fi

current_step="$(awk 'match($0, /^[[:space:]]*step:[[:space:]]*(.*)$/, m) { gsub(/^[[:space:]"]+|[[:space:]"]+$/, "", m[1]); print m[1]; exit }' "$state_file")"
current_step_index="$(awk 'match($0, /^[[:space:]]*step_index:[[:space:]]*(.*)$/, m) { gsub(/^[[:space:]"]+|[[:space:]"]+$/, "", m[1]); print m[1]; exit }' "$state_file")"
current_prompt_file="$(awk 'match($0, /^[[:space:]]*prompt_file:[[:space:]]*(.*)$/, m) { gsub(/^[[:space:]"]+|[[:space:]"]+$/, "", m[1]); print m[1]; exit }' "$state_file")"

if [[ -z "$current_step_index" ]]; then
  current_step_index=0
fi

current_step_status="$(
  awk -v target="$current_step" '
    /steps:/ { in_steps=1; next }
    in_steps && /^[^[:space:]]/ && $0 !~ /^history:/ { in_steps=0 }
    in_steps && match($0, /^[[:space:]]*-[[:space:]]*name:[[:space:]]*(.*)$/, m) {
      name=m[1]
      gsub(/^[[:space:]"]+|[[:space:]"]+$/, "", name)
      active=(name==target)
      next
    }
    in_steps && active && match($0, /^[[:space:]]*status:[[:space:]]*(.*)$/, m) {
      status=m[1]
      gsub(/^[[:space:]"]+|[[:space:]"]+$/, "", status)
      print status
      exit
    }
  ' "$state_file"
)"

last_step_index="$(
  awk '
    /steps:/ { in_steps=1; next }
    in_steps && /^[^[:space:]]/ && $0 !~ /^history:/ { in_steps=0 }
    in_steps && /^[[:space:]]*-[[:space:]]*name:/ { count++ }
    END {
      if (count == 0) print 0
      else print count - 1
    }
  ' "$state_file"
)"

if [[ "$current_step_status" == "running" && "$current_step_index" -lt "$last_step_index" ]]; then
  emit_block "当前步骤 ${current_step} 尚未完成。请完成该步骤后再停止。"
  exit 0
fi

report_base="${current_prompt_file%.md}.report.md"
if [[ "$current_step_index" -ge "$last_step_index" && -n "$current_prompt_file" && ! -f "$reports_dir/$report_base" ]]; then
  emit_block "请生成当前 Prompt 的执行报告后再停止。"
  exit 0
fi

emit_empty
