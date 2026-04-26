# Init Spec

Use this reference for `/hw:init`, which bootstraps or refreshes a `.pipeline/` workspace after understanding the project structure.

## Scenario Detection

| Scenario | Detection | Behavior |
|---|---|---|
| Empty project | no `src/` and no major language files such as `.py`, `.ts`, `.js`, `.java`, `.cpp`, `.rs`, `.go` | create `.pipeline/` skeleton, gather project name / preset / stack / test framework, then generate `config.yaml` plus an empty architecture baseline |
| Existing project | source files exist and `.pipeline/` does not | run the four exploration phases, generate architecture, and propose a prefilled `config.yaml` |
| Existing pipeline | `.pipeline/` already exists | check completeness, suggest missing pieces, and optionally refresh architecture with `--rescan` |

## Progressive Exploration

### Phase 1: Environment Sensing

- detect language and framework from files such as `package.json`, `pyproject.toml`, `Cargo.toml`, `CMakeLists.txt`
- detect the test framework such as `pytest`, `jest`, `gtest`, `cargo test`
- detect CI/CD such as `.github/workflows` or `.gitlab-ci.yml`
- detect package managers, dependency manifests, and monorepo markers

### Phase 2: Structure Scan

- build a directory tree summary
- cluster modules by directory
- identify entrypoints such as `main.py`, `index.ts`, `App.tsx`
- locate config files, exported APIs, and shared interfaces

### Phase 3: Deep Reading

- only for larger projects or modules that are unclear after the first two phases
- inspect key interfaces and type definitions
- map data flow from input to processing to output
- inspect imports to understand module dependencies

### Phase 4: Outputs

- generate an architecture baseline
- generate `config.yaml` with project name, language, preset, and test command hints
- keep agent platform, default execution mode, subagent provider, dashboard defaults, and plan defaults in `~/.hypo-workflow/config.yaml` unless the project needs an explicit override
- optionally suggest an initial development direction, but do not decompose milestones here

## Architecture Output Modes

- small project: fewer than 20 source files -> write `.pipeline/architecture.md`
- large or multi-module project: 20 or more source files, or clear module boundaries -> write `.pipeline/architecture/`

Single-file mode should include:

- project overview
- tech stack
- directory structure
- module summary
- data flow
- key interfaces

Folder mode should contain:

- `INDEX.md`
- `module-<name>.md`
- `data-flow.md`
- `decisions.md`

Flags:

- `/hw:init --folder` forces folder mode
- `/hw:init --single` forces single-file mode
- `/hw:init --rescan` rescans an existing pipeline and diffs against the current architecture baseline

## Relationship To Other Commands

- `/hw:init` creates the baseline architecture
- `/hw:plan` extends that baseline with milestone intent
- `/hw:plan:review` records changes after each milestone
- `/hw:init --rescan` refreshes the baseline when the repo shape has changed materially
