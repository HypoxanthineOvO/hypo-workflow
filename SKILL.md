---
name: prompt-pipeline
version: 4.5.0
description: Run a serialized prompt execution pipeline from a local `.pipeline/` workspace. Use this skill whenever the user says "开始执行", "继续 pipeline", "执行下一步", "pipeline status", "跳过当前步骤", "skip step", "中止", "abort", or invokes `/hw:start`, `/hw:resume`, `/hw:status`, `/hw:skip`, `/hw:stop`, `/hw:report`, `/hw:plan`, or `/hw:review`.
---

## Commands

| Command | Description |
|---------|-------------|
| `/hw:start` | Initialize and start the pipeline from the first prompt |
| `/hw:resume` | Resume from the last interrupted state |
| `/hw:status` | Show current pipeline progress |
| `/hw:skip` | Skip the current prompt and advance |
| `/hw:stop` | Gracefully stop and save state |
| `/hw:report` | Show the latest evaluation scores |
| `/hw:plan` | Enter Plan Mode through `plan/PLAN-SKILL.md` |
| `/hw:plan:discover` | Run the Discover phase of Plan Mode |
| `/hw:plan:decompose` | Run the Decompose phase of Plan Mode |
| `/hw:plan:generate` | Run the Generate phase of Plan Mode |
| `/hw:plan:confirm` | Run the Confirm phase of Plan Mode |
| `/hw:review` | Run Plan Review for the current or all milestones |

When the user types any `/hw:*` command, execute the corresponding action.
Unrecognized `/hw:*` commands should be reported as unknown.
Load [`references/commands-spec.md`](./references/commands-spec.md) when you need parsing rules, parameter semantics, or state-mutation details for slash commands.

# Prompt Pipeline

Use this skill to execute one prompt at a time from a project-local `.pipeline/` directory.

V2.5 is a structural upgrade:

- keep the same pipeline behavior as V1
- move detailed specs into `references/`
- move reusable shell helpers into `scripts/`
- move stable templates into `assets/`
- expose Claude plugin packaging through `.claude-plugin/plugin.json`

The runtime guarantees in this version still focus on:

- `pipeline.source: local`
- `pipeline.output: local`
- `execution.mode: self | subagent`
- recovery through `.pipeline/state.yaml`

If the configuration asks for a capability the current version does not support, stop and say so explicitly.

## Progressive Disclosure

Load the skill in three layers:

1. metadata from this file frontmatter
2. this `SKILL.md` body for core runtime behavior
3. bundled resources on demand:
   - `references/` for detailed policy
   - `assets/` for stable templates and examples
   - `scripts/` for deterministic helper tasks

Prefer not to inline long policy text into the main conversation when a bundled file already defines it.

## Plan Sub-Skill

Plan Mode is implemented as a dedicated sub-skill:

- [`plan/PLAN-SKILL.md`](./plan/PLAN-SKILL.md) is the planning L2 entry point
- `plan/assets/` and `plan/templates/` are planning L3 resources

When the command namespace is:

- `/hw:plan`
- `/hw:plan:*`
- `/hw:review`

load `plan/PLAN-SKILL.md` before executing the command-specific behavior.

## First Actions

1. Read `.pipeline/config.yaml`.
2. Validate it against [`config.schema.yaml`](./config.schema.yaml).
3. When shell access is available, prefer [`scripts/validate-config.sh`](./scripts/validate-config.sh) for a quick structural pre-check before deeper reasoning.
4. Resolve runtime paths from config. Never hardcode prompts, reports, state, or log paths if config overrides them.
5. If `execution` is missing, assume:
   - `mode=self`
   - `subagent_tool=auto`
   - `steps.preset=tdd`
6. If `platform` is missing, assume `auto`.
7. Normalize step overrides:
   - accept top-level `step_overrides`
   - also accept legacy `execution.step_overrides`
   - if both exist, top-level wins
8. Read `.pipeline/state.yaml` if it exists. If not, initialize from [`assets/state-init.yaml`](./assets/state-init.yaml) and then fill in the prompt-specific fields.

## Runtime Resources

Use these bundled files when relevant:

- [`assets/state-init.yaml`](./assets/state-init.yaml)
- [`assets/report-template.md`](./assets/report-template.md)
- [`plan/PLAN-SKILL.md`](./plan/PLAN-SKILL.md)
- [`references/tdd-spec.md`](./references/tdd-spec.md)
- [`references/commands-spec.md`](./references/commands-spec.md)
- [`references/evaluation-spec.md`](./references/evaluation-spec.md)
- [`references/plan-review-spec.md`](./references/plan-review-spec.md)
- [`references/subagent-spec.md`](./references/subagent-spec.md)
- [`references/state-contract.md`](./references/state-contract.md)
- [`references/platform-claude.md`](./references/platform-claude.md)
- [`references/platform-codex.md`](./references/platform-codex.md)
- [`templates/subagent/review-tests.md`](./templates/subagent/review-tests.md)
- [`templates/subagent/review-code.md`](./templates/subagent/review-code.md)
- [`templates/subagent/full-delegation.md`](./templates/subagent/full-delegation.md)
- [`scripts/state-summary.sh`](./scripts/state-summary.sh)
- [`scripts/log-append.sh`](./scripts/log-append.sh)
- [`scripts/diff-stats.sh`](./scripts/diff-stats.sh)

## Supported Commands

Handle these commands directly:

- `/hw:start`, `开始执行`, `start pipeline`
  Start the pipeline. Resume unfinished state if present unless `--clean` is given. With `--from <prompt>`, initialize the current prompt directly to the matched prompt file or prompt stem.
- `/hw:resume`, `继续`, `continue`, `下一步`, `执行下一步`
  Resume from `current.prompt_file` and `current.step`. Treat a user-facing interrupted session as persisted unfinished work, usually `pipeline.status=running|stopped`.
- `/hw:status`, `pipeline status`, `状态`
  Read config plus state and print a concise status summary without mutating work. When shell access is available, prefer [`scripts/state-summary.sh`](./scripts/state-summary.sh).
- `/hw:skip`
  Skip the current prompt, persist a prompt-level skip reason, append a prompt skip log event, and advance to the next prompt without incrementing `pipeline.prompts_completed`.
- `跳过当前步骤`, `skip step`
  Mark the current step as skipped, apply cascade logic when needed, persist state, append log events, and move to the next runnable step.
- `/hw:stop`
  Gracefully stop without aborting the pipeline. Persist state, optionally write an intermediate report, and set `pipeline.status=stopped`. With `--no-report`, skip the intermediate report.
- `/hw:report`
  Load the most recent report file and summarize the latest scores, warnings, and decision.
- `/hw:plan`, `/hw:plan:discover`, `/hw:plan:decompose`, `/hw:plan:generate`, `/hw:plan:confirm`
  Load [`plan/PLAN-SKILL.md`](./plan/PLAN-SKILL.md) and route execution to the corresponding Plan Mode phase.
- `/hw:review`
  Load [`plan/PLAN-SKILL.md`](./plan/PLAN-SKILL.md) and run Plan Review. With `--full`, review all completed milestones instead of only the latest one.
- `中止`, `abort`
  Mark the current prompt and pipeline as aborted, persist state, append a prompt-level log event, and stop.

If a command starts with `/hw:` and is not listed above, return:

`Unknown command: /hw:xxx. Available: /hw:start, /hw:resume, /hw:status, /hw:skip, /hw:stop, /hw:report`

Slash commands are exact and take precedence over fuzzy natural-language matching. Detailed parsing and option semantics live in [`references/commands-spec.md`](./references/commands-spec.md).

If the user command is ambiguous, prefer a safe resume and say which prompt and step you are about to run.

## Config Model

Expected top-level config groups:

- `pipeline`
- `execution`
- `evaluation`
- `platform` optional
- `step_overrides` optional
- `hooks` optional

Key defaults:

- `pipeline.prompts_dir=.pipeline/prompts`
- `pipeline.reports_dir=.pipeline/reports`
- `pipeline.state_file=.pipeline/state.yaml`
- `pipeline.log_file=.pipeline/log.md`
- `execution.mode=self`
- `execution.subagent_tool=auto`
- `execution.steps.preset=tdd`
- `platform=auto`

The main skill only needs the normalized values. It should not care whether the user wrote overrides in the legacy or current location.

## Prompt Discovery

For `source: local`:

1. Read the configured prompts directory.
2. Collect `*.md` files.
3. Sort them by filename ascending.
4. Treat each file as one pipeline prompt.

Prompt files should usually contain:

- `需求`
- `预期测试`
- `预期产出`

If headings differ slightly but meaning is clear, infer by meaning. If critical content is missing, block the prompt instead of guessing.

## Step Presets

Resolve the active step sequence from config:

- `tdd`
  `write_tests -> review_tests -> run_tests_red -> implement -> run_tests_green -> review_code`
- `implement-only`
  `implement -> run_tests -> review_code`
- `custom`
  Use `execution.steps.sequence` exactly as configured.

Apply normalized step overrides after preset expansion:

- skip steps whose override sets `enabled: false`
- honor `strict`
- honor `reviewer`
- honor `subagent_tool`

> 📎 详细步骤规范见 `references/tdd-spec.md`

## Hook 集成（可选）

Resolve platform in this order:

1. config `platform`
2. runtime auto-detection

Platform guidance:

- `claude`
  Prefer Claude-specific delegation and hook metadata.
- `codex`
  Prefer Codex-compatible delegation and treat hook support as minimal.
- `auto`
  Infer from the environment.

If `platform=auto`, detect the environment using repository markers:

- `.claude/` directory or `CLAUDE.md` -> Claude Code
- `.codex/` directory or `AGENTS.md` -> Codex

If `config.yaml` sets `hooks.enabled=true`, treat Hook integration as active when the matching hook files are installed.

### Claude Code（完整 Hook 支持）

If the platform resolves to Claude Code and hooks are installed:

1. **Stop Hook 已激活**
   - the hook runs before the agent stops
   - it checks `state.yaml`, `log.md`, current step state, and report generation
   - it may return `decision:block`
   - the returned `reason` becomes the next concrete instruction for the agent
   - this acts as a passive completion safety net
2. **SessionStart Hook 已激活**
   - the hook injects pipeline state through `additionalContext`
   - startup, resume, and compact all get fresh pipeline status
   - compact reinjection reduces the risk of losing run state after context compression
3. **InstructionsLoaded Hook**（可选）
   - purely observational
   - useful for logging when `SKILL.md` or related instructions reload

When Claude hooks are active, the main skill can simplify some self-check messaging, but it must still preserve the full state machine on its own.

### Codex（降级模式）

If the platform resolves to Codex:

1. there is no Stop Hook
2. there is no SessionStart context injection
3. recovery still depends on the agent reading `state.yaml` directly
4. `notify` is optional and only provides turn-complete observability
5. `AGENTS.md` should carry the discipline that hooks cannot enforce

This means Codex keeps the V1 behavior: the skill itself is responsible for stop safety, recovery, and report discipline.

### Hook 日志

Hook events should be written through [`scripts/log-append.sh`](./scripts/log-append.sh) when possible.

Preferred format:

```markdown
## {timestamp} - hook:{hook_name}
- result: pass | block | warning
- message: ...
```

Hook sensing rules:

- If a `hooks/` directory exists in the project root, note that hook data may be available.
- If config contains `hooks.enabled=true`, prefer the installed hooks but do not rely on them for correctness in non-Claude environments.
- Hook facts may enrich notes, logging, or subagent context.
- Hook facts must never replace the core state machine.

Use platform-specific details only after reading the matching reference:

- Claude -> [`references/platform-claude.md`](./references/platform-claude.md)
- Codex -> [`references/platform-codex.md`](./references/platform-codex.md)

> 📎 Claude 细节见 `references/platform-claude.md`
>
> 📎 Codex 细节见 `references/platform-codex.md`

## State Core

Persist state to the configured state file after every meaningful transition.

Core shape:

```yaml
pipeline:
  name: Hypo-TODO
  status: idle | running | blocked | aborted | stopped | completed
  prompts_total: 0
  prompts_completed: 0
  started: null
  finished: null
current:
  prompt_index: 0
  prompt_file: 00-scaffold.md
  prompt_name: scaffold
  step: write_tests
  step_index: 0
prompt_state:
  started_at: null
  updated_at: null
  finished_at: null
  result: running | pass | blocked | aborted | stopped | skipped
  diff_score: null
  code_quality: null
  steps:
    - name: write_tests
      status: pending | running | done | skipped | blocked
      executor: self | subagent
      subagent_tool: codex | claude | auto | null
      subagent_result: null
      reason: null
      started_at: null
      finished_at: null
      duration_seconds: null
      notes: ""
history:
  completed_prompts: []
```

Core write rules:

- `current.step` must always point at the next runnable or currently running step.
- `current.step_index` must match the position inside `prompt_state.steps`.
- skipped steps must record both `status=skipped` and a machine-readable `reason`.
- delegated steps must record the actual `executor`, actual `subagent_tool`, and parsed `subagent_result` when available.

评估完成后写入 `state.yaml` 的 `evaluation` 块：

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
该块应存在于当前 prompt 的运行态，并在 prompt 完成后复制到 `history[].evaluation`。

> 📎 完整字段、时机和版本演化见 `references/state-contract.md`

## Logging Core

Append Markdown to the configured log file.

Record only:

- step start
- step finish
- prompt start
- prompt finish
- prompt blocked
- prompt skipped
- prompt stopped

Do not record pipeline-wide lifecycle events such as "pipeline initialized".

Preferred shape:

```markdown
## 2026-04-22T16:01:00+08:00 - 00-scaffold - write_tests - finish
- status: done
- executor: self
- notes: wrote 8 tests across 2 files
```

When shell access is available, prefer [`scripts/log-append.sh`](./scripts/log-append.sh) for simple standardized writes.

## Main State Machine

Use this loop for `/hw:start`, `/hw:resume`, `start pipeline`, `continue`, `下一步`, and auto-continue decisions:

1. Read config and normalize runtime values.
2. Discover prompt files.
3. Initialize state if missing.
4. If pipeline is already `completed`, report completion and stop unless the user explicitly asks to restart or uses `/hw:start --clean`.
5. If pipeline is `aborted` or `stopped`, resume only on explicit continue/start/resume.
6. Load the current prompt.
7. Find the next step whose status is not `done` or `skipped`.
8. If this is a fresh prompt entry, append one prompt-level `prompt_start` log event.
9. Mark the selected step as `running`, record `started_at`, record the resolved executor, and append a step-start log event.
10. Execute the step according to the preset, overrides, skip cascade state, and delegation rules.
11. Record notes, timing, actual executor, and result.
12. Persist state and append a step-finish log event.
13. If the step blocks, mark prompt and pipeline as blocked, append a prompt-level block event, persist state, and stop.
14. When all enabled steps finish, generate the prompt report, compute evaluation, write final prompt fields, append a prompt-finish log event, and persist state.
15. If the prompt passed and architecture tracking is active, run Plan Review before advancing.
16. After Plan Review, add the prompt to history and advance state to the next prompt immediately.
17. If `auto_continue=false`, stop after the state advance and wait for the user to say `继续`.
18. If there is no next prompt, mark the pipeline `completed`, persist state, and stop.

## Skip Cascade

General skip rules:

- keep the current prompt recoverable
- mark every skipped step explicitly
- record a reason
- append skip events to the log

Special cascade from `write_tests` in `tdd`:

1. mark `write_tests` as `skipped` with `reason=user_skipped`
2. mark `review_tests` as `skipped` with `reason=dependency_skipped`
3. mark `run_tests_red` as `skipped` with `reason=dependency_skipped`
4. continue from `implement`
5. keep `run_tests_green` runnable
6. downgrade `run_tests_green` to inline validation
7. set `run_tests_green.notes` to `fallback=inline_validation, reason=tests_skipped`
8. log the downgrade before `run_tests_green` starts

Inline validation means:

- check imports
- check syntax
- record `inline_validation` in state and log

`implement-only` and custom flows may also use inline validation when no tests exist for the current prompt.

## Subagent Entry Point

Delegation is allowed only when:

- `execution.mode=subagent`
- the normalized step override resolves `reviewer=subagent`

Delegation flow:

1. choose the correct subagent template
2. assemble prompt context from the active prompt, changed files, and relevant tests
3. resolve the actual tool from step override, execution default, and platform
4. try the delegated execution
5. parse JSON output
6. merge the structured result back into state

Tool selection:

- `auto`
  choose the best supported backend for the current platform
- `claude`
  prefer Claude subagent definitions or `claude -p`
- `codex`
  prefer `codex exec`

Fallback rules:

1. if the tool is unavailable, execution fails, or JSON cannot be parsed, rerun the same step locally
2. set `subagent_fallback=true` in the log note
3. set a concise fallback `reason`
4. mark the actual executor as `self`
5. never block the pipeline because delegation failed by itself

The main skill should only own the routing and fallback. Template content and detailed note formats belong in the reference layer.

> 📎 Subagent 细节见 `references/subagent-spec.md`

## 评估决策（V4 多维度）

`review_code` 完成后，对本轮 Prompt 执行多维度评分。

> 📎 各维度评分标准、权重公式、架构漂移检测细则见 `references/evaluation-spec.md`

评分维度：

- `diff_score`
- `code_quality`
- `test_coverage`（仅 TDD）
- `complexity`
- `architecture_drift`
- `overall`

阻塞决策：

- `STOP`（任一触发）:
  - `diff_score > threshold`
  - `architecture_drift >= 4`
  - `overall > threshold + 1`
- `WARN`（记录不阻塞）:
  - `complexity >= 4`
  - `test_coverage <= 2`
- `threshold = adaptive_threshold` 或 `max_diff_score`

自适应阈值在 `evaluation.adaptive_threshold=true` 时启用：

- 连续 3 个 `diff_score <= 2` -> 收紧
- 出现 `STOP` -> 放宽
- 其他情况 -> 保持
> 📎 自适应阈值详细规则见 `references/evaluation-spec.md`

向后兼容要求：

- 当 `adaptive_threshold=false` 时，保持 V3 的 `diff_score > max_diff_score` 主判定行为
- 多维评分仍可写入 state 和报告，但不应破坏旧配置的默认流转语义

报告规则：

- 使用 [`assets/report-template.md`](./assets/report-template.md)
- 每个 prompt 写一份报告
- 当需要目录变化和 diff 统计时，优先复用 [`scripts/diff-stats.sh`](./scripts/diff-stats.sh)

## Plan Review

When the pipeline was generated through Plan Mode and `.pipeline/architecture.md` exists:

- run Plan Review after prompt evaluation and before prompt advance
- compare the completed milestone against the current `architecture.md` baseline
- record `ADDED`, `CHANGED`, `REASON`, and `IMPACT`
- inspect whether downstream prompts should be revised before they run

Detailed review behavior belongs in [`references/plan-review-spec.md`](./references/plan-review-spec.md).

## Restart And Abort

If the user explicitly asks to restart:

1. keep old reports and logs unless deletion is explicitly requested
2. reinitialize state from `assets/state-init.yaml`
3. set the first prompt and its first runnable step
4. make it clear that the run is a restart, not a resume

If the user asks to stop gracefully or invokes `/hw:stop`:

1. persist the current prompt and pipeline state
2. set `pipeline.status=stopped`
3. if `--no-report` is not present, write an intermediate report for the current prompt
4. append one prompt-level stop event
5. stop without discarding context or marking the prompt aborted

If the user asks to abort:

1. mark prompt and pipeline as aborted
2. persist state
3. append one prompt-level log event
4. stop without discarding context

## Failure Handling

Stop and explain the reason when:

- config is invalid
- prompt files are missing
- preset expansion fails
- custom sequence is missing
- a detailed reference file needed for the current branch is missing
- evaluation cannot be computed from available evidence
- the prompt is blocked by `diff_score`

Prefer explicit blocking over silent guessing.

## Platform Packaging

This skill is packaged for Claude plugin installation through:

- [`.claude-plugin/plugin.json`](./.claude-plugin/plugin.json)

That manifest should only point to this `SKILL.md`. Hooks, commands, and agent definitions can grow in later versions without changing the core state machine here.

## Deprecated Layout

The old `templates/` directory is retained for compatibility but is now considered deprecated.

- reports now live in `assets/report-template.md`
- TDD policy now lives in `references/tdd-spec.md`
- evaluation policy now lives in `references/evaluation-spec.md`
- subagent prompt templates remain in `templates/subagent/`

Read [`templates/DEPRECATED.md`](./templates/DEPRECATED.md) before adding new material to the old template tree.

## Boundaries

V4 extends evaluation behavior but still does not add new remote execution capabilities beyond the existing runtime model.

Do not claim support for:

- remote prompt execution beyond the existing supported adapters
- non-local reports in this packaged layout unless the runtime explicitly supports them
- concurrent fan-out delegation for one step
- replacing the state machine with hook-only orchestration
- deleting the deprecated template tree automatically
