---
name: cycle
description: Manage Hypo-Workflow Cycles with independent milestone sequences, state, progress, reports, archives, and summaries.
---

# /hypo-workflow:cycle

Use this skill when the user invokes `/hw:cycle` or `/hypo-workflow:cycle`.

Cycles are project-level delivery containers. Each Cycle owns its own milestone sequence, `.pipeline/state.yaml`, `.pipeline/PROGRESS.md`, `.pipeline/prompts/`, and `.pipeline/reports/`. Milestone numbers restart from `M0` inside every Cycle. Cross-Cycle files stay in place.

## Paths

All paths are relative to `.pipeline/` unless a project-root path is explicitly named:

- active Cycle: `.pipeline/cycle.yaml`
- archives: `.pipeline/archives/C{N}-{slug}/`
- patches: `.pipeline/patches/`
- project summary: project-root `PROJECT-SUMMARY.md`
- persistent files: `.pipeline/architecture.md`, `.pipeline/config.yaml`, `.pipeline/log.yaml`, `.pipeline/patches/`

## Commands

Supported forms:

- `/hw:cycle new "名称" [--type feature|bugfix|refactor|spike|hotfix] [--context audit,patches,deferred,debug]`
- `/hw:cycle list`
- `/hw:cycle view C{N}`
- `/hw:cycle close [--reason "..."] [--paused]`

## Cycle File

Create `.pipeline/cycle.yaml` with this shape:

```yaml
cycle:
  number: 1
  name: "初始开发"
  type: feature
  status: active
  started: "2026-04-28T12:00:00+08:00"
  preset: tdd
  context_sources: []
  previous_cycle: null
  summary: null
  lessons: null
```

Use an ISO-8601 timestamp with timezone. Resolve timezone from `output.timezone`; default to `UTC`.

## Type And Preset Mapping

- `feature` -> `tdd`
- `refactor` -> `tdd`
- `bugfix` -> `implement-only`
- `spike` -> `implement-only`
- `hotfix` -> `implement-only`

The user may edit `.pipeline/cycle.yaml` to override `cycle.preset`. Do not overwrite a user override unless the user explicitly asks.

## `/hw:cycle new`

1. Read `.pipeline/config.yaml` and optional `~/.hypo-workflow/config.yaml`.
2. If `.pipeline/cycle.yaml` exists and `cycle.status=active`, first run the archive flow from this skill before creating the new Cycle.
3. Determine the next number by scanning:
   - the existing active `.pipeline/cycle.yaml`
   - `.pipeline/archives/C*/cycle.yaml`
   - archive directory names matching `C{N}-*`
4. If no Cycle files exist, create the first explicit Cycle as `C1`.
5. Slugify the name for archive paths when needed.
6. Resolve `--type`; default to `feature` if omitted.
7. Resolve `--context`; store supported values in `cycle.context_sources`.
8. Create `.pipeline/cycle.yaml`.
9. Reset Cycle-local runtime:
   - reset `.pipeline/state.yaml` from `assets/state-init.yaml`
   - remove files under `.pipeline/prompts/`
   - remove files under `.pipeline/reports/`
   - remove `.pipeline/PROGRESS.md` if it belongs to the prior Cycle
10. Preserve:
   - `.pipeline/architecture.md`
   - `.pipeline/config.yaml`
   - `.pipeline/log.yaml`
   - `.pipeline/patches/`
   - `.pipeline/archives/`
11. Report the new Cycle number, name, type, preset, and context sources.

Compatibility: projects without `.pipeline/cycle.yaml` are treated as an implicit `C1` only for display and migration context. `/hw:init` must not create `.pipeline/cycle.yaml`.

## `/hw:cycle close`

Close the active Cycle and archive its local artifacts.

Status rules:

- no flag -> `completed`
- `--reason "..."` -> `abandoned` and record the reason as `cycle.lessons`
- `--paused` -> `paused`

Execution:

1. Require `.pipeline/cycle.yaml`. If it is missing, say there is no explicit active Cycle and keep old projects unchanged.
2. Read `.pipeline/state.yaml` if present.
3. Update `cycle.status`, `cycle.summary`, `cycle.lessons`, and finish timestamp.
4. Run the Archive Flow.
5. Update project-root `PROJECT-SUMMARY.md`.
6. Leave `.pipeline/` containing only persistent files plus any newly generated summary.

## Archive Flow

Create `.pipeline/archives/C{N}-{slug}/` and move or copy files as follows:

- move `.pipeline/PROGRESS.md` -> `archives/C{N}-{slug}/PROGRESS.md`
- move `.pipeline/state.yaml` -> `archives/C{N}-{slug}/state.yaml`
- move `.pipeline/cycle.yaml` -> `archives/C{N}-{slug}/cycle.yaml`
- move `.pipeline/prompts/` -> `archives/C{N}-{slug}/prompts/`
- move `.pipeline/reports/` -> `archives/C{N}-{slug}/reports/`
- copy `.pipeline/architecture.md` -> `archives/C{N}-{slug}/architecture-snapshot.md`

After moving directories, recreate empty `.pipeline/prompts/` and `.pipeline/reports/` only when a new Cycle is being created immediately. For close-only, leave them absent unless the project tooling requires empty directories.

Do not archive or delete:

- `.pipeline/architecture.md`
- `.pipeline/config.yaml`
- `.pipeline/log.yaml`
- `.pipeline/patches/`
- `.pipeline/archives/`
- project-root `PROJECT-SUMMARY.md`

## Deferred Items

When closing, scan `.pipeline/state.yaml` before moving it. For every milestone with `status: in_progress` or `status: pending`, add an entry to `.pipeline/archives/C{N}-{slug}/deferred.yaml`:

```yaml
- milestone: "M3"
  name: "..."
  reason: "cycle closed"
```

Also mark the archived `state.yaml` milestone status as `deferred` and set `deferred_reason: cycle closed` when feasible.

## Archive Summary

Generate `.pipeline/archives/C{N}-{slug}/summary.md`.

The summary must include:

- Cycle number, name, type, status, started, finished, and preset
- one sentence per milestone
- key data when available: tests, score, final decision, warnings
- deferred item count and names
- for abandoned Cycles, `lessons`

Write the summary in `output.language`; default language is English.

## `/hw:cycle list`

List all Cycles from:

- `.pipeline/archives/*/cycle.yaml`
- current `.pipeline/cycle.yaml` when present

Show number, name, type, status, started/finished date, and one-line summary. Include implicit `C1` only when there is no explicit Cycle metadata and the old project has `.pipeline/state.yaml` or prompts.

## `/hw:cycle view C{N}`

Find the Cycle in current metadata or archives. Display:

- Cycle metadata
- archive path
- summary excerpt
- deferred items
- report list
- architecture snapshot path when present

If the Cycle is missing, list available Cycle numbers.

## Project Summary

After every close or archive, regenerate project-root `PROJECT-SUMMARY.md` using the rules in `/hypo-workflow:status` and this skill. This file is cross-Cycle project context and should not be moved into Cycle archives.

## Reference Files

- `references/commands-spec.md` — command parsing and unknown-command behavior
- `references/state-contract.md` — milestone status fields
- `references/progress-spec.md` — PROGRESS relationship
- `references/config-spec.md` — output language and timezone defaults
- `SKILL.md` — full system context
