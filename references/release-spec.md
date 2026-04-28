# Release Spec

Use this reference for `/hw:release`, the automated publishing workflow for Hypo-Workflow style projects.

## Flow

### Step 1: Preflight

- ensure the git worktree is clean
- ensure the current branch is `main` or `master`
- ensure there is no unfinished milestone in `state.yaml`

### Step 2: Regression

- run `tests/run_regression.py`, or the configured project test command when a project-specific override exists
- continue only if the full regression is green
- if tests fail, stop immediately with the failing summary

### Step 3: Version Calculation

- read the current version from `.claude-plugin/plugin.json`
- inspect git history since the last tag
- bump `major` when there is `BREAKING CHANGE` or `feat!`
- bump `minor` when there is `feat`
- bump `patch` when commits are limited to `fix`, `docs`, `chore`, or similar
- let `--patch`, `--minor`, or `--major` override the automatic bump

### Step 4: File Updates

- update `.claude-plugin/plugin.json`
- update version mentions in `README.md`
- update the version note in `SKILL.md` or `PLAN-SKILL.md` when present

### Step 5: Changelog

- diff from the last git tag to `HEAD`
- group commits by conventional type
- write the newest release block to the top of `CHANGELOG.md`
- use `output.language` for generated changelog prose
- render dates in `output.timezone`

Preferred shape:

```markdown
## vX.Y.Z - YYYY-MM-DD

### Features
- feat: ...

### Fixes
- fix: ...

### Other
- docs: ...
```

### Step 6: Git Operations

- `git add -A`
- `git commit -m "release: vX.Y.Z"`
- `git tag vX.Y.Z`
- `git push`
- `git push --tags`

### Step 7: GitHub Release

- if `gh` is available, create `gh release create vX.Y.Z --title "vX.Y.Z" --notes "<changelog>"`
- otherwise stop after printing the generated changelog text for manual release entry

## Command Forms

- `/hw:release`
- `/hw:release --dry-run`
- `/hw:release --skip-tests`
- `/hw:release --patch`
- `/hw:release --minor`
- `/hw:release --major`

## Safety Rules

- `--dry-run` prints every planned step, file mutation, version bump, and tag without changing files or git state
- `--skip-tests` is dangerous and requires explicit second confirmation before continuing
- always write a lifecycle entry to `.pipeline/log.yaml` with `type: release`
