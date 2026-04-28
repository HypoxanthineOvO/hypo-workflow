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
