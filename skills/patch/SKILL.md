---
name: patch
description: Manage the persistent lightweight Patch track for small fixes that should not open a full milestone.
---

# /hypo-workflow:patch

Use this skill when the user invokes `/hw:patch` or `/hypo-workflow:patch`.

Patch is a persistent side track for small issues, cleanups, and hot observations that do not deserve their own milestone. It is independent of the pipeline state machine and persists across Cycles.

## Paths

Canonical Patch directory:

- `.pipeline/patches/`

When examples say `patches/P001-fix-login.md`, interpret it as `.pipeline/patches/P001-fix-login.md`.

## Commands

Supported forms:

- `/hw:patch "描述" [--severity critical|normal|minor]`
- `/hw:patch list [--open] [--severity critical|normal|minor]`
- `/hw:patch close P{NNN}`
- `/hw:patch fix P{NNN} [P{NNN} ...]`

## Patch File Format

```markdown
# P001: 修复登录页 CSS 错位
- 严重级: normal
- 状态: open
- 发现于: C2/M3
- 创建时间: 28日 11:30
- 改动: (待填写)
- 测试: (待填写)
- 关联: (无)
- resolved_by: null
- related: []
- supersedes: []
```

Use `output.language` for labels when generating new content, but preserve the existing file's language when editing it.

## Numbering

Patch numbers are global and never reset across Cycles.

1. Create `.pipeline/patches/` if it does not exist.
2. Scan filenames matching `P[0-9][0-9][0-9]-*.md`.
3. Determine the next number as max existing number + 1.
4. Format as `P001`, `P002`, and so on.
5. Do not reuse closed or superseded numbers.

## Creating A Patch

For `/hw:patch "描述" [--severity ...]`:

1. Parse the quoted description as the title.
2. Validate severity:
   - default: `normal`
   - allowed: `critical`, `normal`, `minor`
3. Slugify the title for the filename.
4. Detect active Cycle context:
   - if `.pipeline/cycle.yaml` exists and status is `active`, use `C{cycle.number}`
   - if `.pipeline/state.yaml` has a current milestone or prompt index, append `/M{N}`
   - if no explicit Cycle exists, leave `discovered_in` as `(无)` or `implicit C1` only in display text
5. Resolve the creation time using `output.timezone`.
6. Create `.pipeline/patches/P{NNN}-{slug}.md`.
7. Report the file path and status.

## Listing Patches

For `/hw:patch list`:

1. Read all `.pipeline/patches/P*.md` files.
2. Parse metadata from the header bullets.
3. Sort by number ascending.
4. Show number, title, severity, status, discovered_in, and related/resolved_by when present.

Filters:

- `--open`: include only `状态: open`
- `--severity critical|normal|minor`: include only matching severity

If no patches match, say so directly.

## Closing A Patch

For `/hw:patch close P{NNN}`:

1. Find the matching Patch file.
2. Replace `状态: open` with `状态: closed`.
3. Add or update a closed timestamp using `output.timezone`.
4. Preserve all other metadata and freeform notes.
5. If the Patch is already closed, report that no mutation was needed.

When a milestone resolves one or more Patches, update `resolved_by` with `C{N}/M{N}` and close the Patch only when the milestone actually delivered the fix.

## Fixing Patches

Use `/hw:patch fix P001` to repair one Patch immediately, or `/hw:patch fix P001 P003 P007` to repair several Patches in sequence. Patch fix is a lightweight execution lane, not a Milestone and not a TDD pipeline run.

### ⚠️ Patch Fix 执行约束

❌ 绝对禁止：
1. 启动 brainstorming 或 Plan Discover
2. 走完整 TDD 流水线（write_tests → run_red → ...）
3. 写入 state.yaml（Patch 不是 Milestone）
4. 生成 report.md
5. 单个 Patch 改动超过 5 个文件时不提醒用户
6. 顺手重构不相关代码

✅ 必须做到：
1. 读取 Patch 描述后直接定位和修复
2. 跑现有测试验证不破坏其他功能
3. 单次 commit，message 格式：fix(P<NNN>): <描述>
4. 自动关闭 Patch 并更新文件
5. 超出范围时停下来建议升级为 Milestone

### Linear Fix Flow

For each requested Patch, run these six steps strictly in order:

1. **Read Patch** — locate `.pipeline/patches/P{NNN}-*.md`, parse title, description, `discovered_in`, and severity. If the Patch status is already `closed`, report an error for that Patch and skip mutation.
2. **Locate Code** — use file paths, module names, stack traces, or error text from the Patch body. Read at most 5 related files before deciding whether the scope is understood. Do not run a broad repo-wide scan unless the Patch text gives no concrete anchor; if that happens, ask the user for a file/module hint instead.
3. **Fix** — apply the smallest targeted change. If the repair requires touching more than 5 files, stop that Patch and recommend upgrading it to a Milestone or Cycle plan item. Do not perform opportunistic refactors.
4. **Test** — run the existing project test suite or the narrowest existing regression command that covers the change. Optionally add one targeted regression test when the Patch exposes a repeatable bug. If tests fail, revert only the changes made for that Patch, keep the Patch `open`, and continue to the next requested Patch.
5. **Commit** — create one independent commit per Patch with `git commit -m "fix(P001): <Patch title>"`. For batch fixes, do not combine Patch commits.
6. **Close** — update the Patch file, append one `.pipeline/PROGRESS.md` line, and append a lifecycle event to `.pipeline/log.yaml`.

### Closed Patch Update

When Step 6 succeeds, update or append these fields in the Patch file while preserving existing notes:

```markdown
- 状态: closed
- 修复时间: 29日 14:30
- 改动: src/scheduler.py:120 — 修正条件判断逻辑
- 测试: ✅ 回归通过（38/38）
- commit: `a1b2c3d`
```

Use `output.language` and `output.timezone` for generated prose and time formatting. Preserve the existing Patch language if it is already clear.

### Progress And Log Records

Append one concise line to `.pipeline/PROGRESS.md`:

```markdown
14:30 P001 closed — 修复了 xxx
```

Append a `.pipeline/log.yaml` lifecycle event with:

- `type: patch_fix`
- `patch: P001`
- `status: closed`
- `commit: <hash>`
- `summary: <one-line change summary>`
- `tests: <test command and result>`

Patch fix must never write `.pipeline/state.yaml` and must never generate `report.md`.

### Batch Fixes

For `/hw:patch fix P001 P003`:

1. Execute the six-step flow independently for each Patch.
2. A failed Patch must not block later Patches.
3. Each successful Patch gets its own commit.
4. Finish with a summary such as `3/4 修复成功，P003 失败（测试未通过）`.

## Metadata Semantics

- `discovered_in`: Cycle and milestone where the Patch was found
- `resolved_by`: Cycle and milestone or Patch that resolved it
- `related`: related Patch IDs
- `supersedes`: older Patch IDs replaced by this Patch

## Relationship To Cycles

Patches are not archived when a Cycle closes. They stay in `.pipeline/patches/` and can be injected into future planning with `/hw:plan --context patches` or `cycle.context_sources: [patches]`.

## Reference Files

- `skills/cycle/SKILL.md` — active Cycle detection
- `skills/plan-discover/SKILL.md` — Patch context injection
- `references/config-spec.md` — output language and timezone defaults
- `SKILL.md` — root command routing
