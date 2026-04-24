# State Contract

This file defines the full `state.yaml` contract used by the pipeline.

## Top-Level Structure

```yaml
pipeline:
  name: ""
  status: idle | running | blocked | aborted | stopped | completed
  prompts_total: 0
  prompts_completed: 0
  started: null
  finished: null
current:
  phase: idle | plan_discover | plan_decompose | plan_generate | plan_confirm | executing | lifecycle_init | lifecycle_check | lifecycle_audit | lifecycle_release | lifecycle_debug | completed
  prompt_index: 0
  prompt_file: null
  prompt_name: null
  step: null
  step_index: 0
milestones: []
prompt_state:
  started_at: null
  updated_at: null
  finished_at: null
  result: running | pass | blocked | aborted | stopped | skipped
  diff_score: null
  code_quality: null
  steps: []
history:
  completed_prompts: []
```

## Milestone Record Fields

Each `milestones[]` item may contain:

- `name`
- `status`
- `deferred_reason`

Allowed milestone status values:

- `done`
- `in_progress`
- `deferred`
- `failed`
- `skipped`

## Step Record Fields

Each `prompt_state.steps[]` item may contain:

- `name`
- `status`
- `executor`
- `subagent_tool`
- `subagent_result`
- `reason`
- `started_at`
- `finished_at`
- `duration_seconds`
- `notes`

## Read / Write Timing

Write `state.yaml` at these moments:

- pipeline initialization
- prompt start
- step start
- step finish
- any skip cascade update
- prompt skip
- graceful stop
- prompt finish
- prompt blocked
- abort or restart

Read `state.yaml` at these moments:

- `start pipeline`
- `continue`
- `pipeline status`
- `/hw:resume`
- `/hw:status`
- `/hw:skip`
- `/hw:stop`
- `/hw:report`
- `skip step`
- `abort`

## Field Dependencies

- `current.step` must always point to the next runnable or currently running step.
- `current.step_index` must match the index of `current.step` inside `prompt_state.steps`.
- `current.phase` should reflect whether the system is in planning, execution, lifecycle, or completion state.
- `pipeline.prompts_completed` must equal the number of successful prompt entries in `history.completed_prompts`.
- `prompt_state.diff_score` drives the final decision gate.
- `prompt_state.code_quality` informs the `code_quality` evaluation check.
- `executor=subagent` implies `subagent_tool` is not null and `subagent_result` should exist unless parsing failed.
- `status=skipped` should carry a `reason`.
- `milestones[].status=deferred` should carry `deferred_reason`.
- `pipeline.status=stopped` means the run is intentionally paused and resumable.
- `prompt_state.result=stopped` means the current prompt was paused mid-flight and should resume from `current.step`.
- prompt-level `result=skipped` should not increment `pipeline.prompts_completed`.
- `history.completed_prompts` is a legacy field name and may contain non-pass entries such as `blocked`, `aborted`, or `skipped`.

## Version History

### V0

Introduced:

- pipeline/current/prompt_state/history structure
- step status and timing
- `diff_score`
- notes-based logging model

### V0.5

Added:

- `code_quality`
- explicit skip reasons
- inline validation fallback notes
- consistent next-prompt advance semantics

### V1

Added:

- `executor`
- `subagent_tool`
- `subagent_result`

### V4.5

Added:

- slash-command-aware resumable stop state through `pipeline.status=stopped`
- prompt-level `result=stopped`
- prompt-level `result=skipped`
- prompt skip / graceful stop write timing

### V6.2

Added:

- `current.phase`
- milestone-level tracking through `milestones[]`
- `milestones[].status=deferred`
- `milestones[].deferred_reason`
- explicit separation between machine-readable `log.yaml` and human-readable `PROGRESS.md`

## V4 新增字段

### history[].evaluation

每个 Prompt 完成后写入：

```yaml
evaluation:
  diff_score: 1-5
  code_quality: 1-5
  test_coverage: 1-5 | null
  complexity: 1-5
  architecture_drift: 1-5
  overall: 1-5
  adaptive_threshold: 2-5
  warnings:
    - "..."
```

说明：

- `test_coverage` 在非 TDD 模式为 `null`
- `overall` 是加权综合结果
- `warnings` 保存本轮触发的 WARN 条件

### pipeline.adaptive_threshold

仅当 `evaluation.adaptive_threshold=true` 时存在：

- 类型：`integer (2-5)`
- 初始值：`evaluation.base_max_diff_score`
- 更新时机：每轮 Prompt 评估完成后

### prompt_state.evaluation

当前 Prompt 在内存和 state 中应保留当前评估块：

```yaml
evaluation:
  diff_score: 1-5
  code_quality: 1-5
  test_coverage: 1-5 | null
  complexity: 1-5
  architecture_drift: 1-5
  overall: 1-5
  adaptive_threshold: 2-5
  warnings:
    - "..."
```

该块适合在 prompt 完成时复制到 `history[].evaluation`。

## Full Example

```yaml
pipeline:
  name: Hypo-TODO
  status: running
  prompts_total: 4
  prompts_completed: 1
  started: 2026-04-22T10:00:00Z
  finished: null
current:
  phase: executing
  prompt_index: 1
  prompt_file: 01-core-crud.md
  prompt_name: core-crud
  step: review_code
  step_index: 5
milestones:
  - name: 00-scaffold
    status: done
    deferred_reason: null
  - name: 01-core-crud
    status: in_progress
    deferred_reason: null
prompt_state:
  started_at: 2026-04-22T10:10:00Z
  updated_at: 2026-04-22T10:18:00Z
  finished_at: null
  result: running
  diff_score: null
  code_quality: null
  steps:
    - name: write_tests
      status: done
      executor: self
      subagent_tool: null
      subagent_result: null
      reason: null
      started_at: 2026-04-22T10:10:00Z
      finished_at: 2026-04-22T10:11:00Z
      duration_seconds: 60
      notes: wrote 8 tests
    - name: review_tests
      status: done
      executor: subagent
      subagent_tool: codex
      subagent_result:
        verdict: pass
        issues: []
        coverage_assessment: sufficient
        suggestions: []
      reason: null
      started_at: 2026-04-22T10:11:00Z
      finished_at: 2026-04-22T10:12:00Z
      duration_seconds: 60
      notes: executor=subagent tool=codex verdict=pass
    - name: run_tests_red
      status: done
      executor: self
      subagent_tool: null
      subagent_result: null
      reason: null
      started_at: 2026-04-22T10:12:00Z
      finished_at: 2026-04-22T10:13:00Z
      duration_seconds: 60
      notes: expected failures observed
history:
  completed_prompts:
    - prompt_file: 00-scaffold.md
      result: pass
      diff_score: 1
      code_quality: 4
      report_file: .pipeline/reports/00-scaffold.report.md
```
