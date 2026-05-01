# C2 Design Spec — README, Skills, OpenCode UI, Batch Plan, and Project Report

## Goal

C2 turns Hypo-Workflow from a V9 OpenCode-compatible workflow into a more maintainable, observable, and batch-capable project.

The Cycle has five Feature-level goals:

1. keep README and release documentation fresh automatically;
2. regularize the Skill system without risky deletion or merging;
3. expose Hypo-Workflow status directly inside OpenCode TUI;
4. add batch planning through a persistent Feature Queue;
5. produce a detailed technical report and LaTeX Beamer slides for lab presentation.

## Project Shape

- Project type: multi-platform agent workflow / skill bundle.
- Primary deliverables: specs, rules, generated artifacts, OpenCode adapter enhancements, queue/metrics contracts, report/slides.
- Target platforms: Codex, Claude Code, OpenCode.
- Expected users: project maintainer, lab users, open-source users, and future contributors.

## Constraints

- Preserve existing single-feature `/hw:plan` behavior.
- Preserve `Cycle > Feature > Milestone` hierarchy:
  - Cycle owns archive and delivery boundary.
  - Feature is a batch-planning queue item.
  - Milestone remains the executable prompt/report unit.
  - Patch stays as a cross-Cycle side track with `discovered_in` and `resolved_by` references.
- Keep Milestone numbering Cycle-global and continuous. Feature ownership is metadata, not a numbering reset.
- Do not merge or delete existing Skills in this Cycle.
- Keep OpenCode additions as adapter capabilities. Do not turn Hypo-Workflow into a separate runner.
- Treat token and cost metrics as best-effort because platforms expose different telemetry.

## Existing Context

- Existing repo detected: yes.
- Existing `.pipeline/` detected: yes.
- Active Cycle: C2.
- Key files:
  - `skills/*/SKILL.md`
  - `SKILL.md`
  - `plan/PLAN-SKILL.md`
  - `references/*`
  - `core/src/*`
  - `plugins/opencode/templates/*`
  - `.opencode/commands/*`
  - `.opencode/agents/*`
  - `.opencode/plugins/hypo-workflow.ts`

## Confirmed Feature Queue

| ID | Feature | Summary |
|---|---|---|
| F001 | README 自动更新 | Define README spec/data sources, add release `update_readme`, and add freshness checks. |
| F002 | Skill 体系整理 | Improve Skill structure, naming, references, quality rules, and platform mappings without merge/delete. |
| F003 | OpenCode 状态面板 | Add TUI sidebar and footer panels for workflow status, recent events, time, tokens, and cost. |
| F004 | Batch Plan | Add Feature Queue, upfront/JIT decomposition, natural-language queue edits, metrics, and auto-chain policy. |
| F005 | 项目技术报告与 Beamer Slides | Write detailed technical report first, then generate Beamer source, PDF, and assets. |

## Functional Requirements

### F001 README 自动更新

- Add `templates/readme-spec.md`.
- Define README section structure and dynamic data sources.
- Add `update_readme` into `/hw:release`.
- Add `readme-freshness` pre-release rule.
- Default behavior replaces managed marker blocks.
- Full README regeneration is allowed under loose local defaults.
- Strict/shared release profiles should require confirmation or deny full regeneration.
- Suggested configuration:
  - `release.readme.mode: loose | strict`
  - `release.readme.full_regen: auto | ask | deny`

### F002 Skill 体系整理

- Audit all Skill assets.
- Create `references/skill-spec.md`.
- Standardize frontmatter, trigger description, execution flow, reference files, platform mapping, and protected-file notes.
- Move overly long details into `references/`, `examples/`, or `scripts/` where appropriate.
- Add `skill-quality` rule/checking surface.
- Keep existing Skills; do not merge or delete in this Cycle.
- Reference external quality patterns:
  - Oh My OpenAgent
  - SuperSkills / agentskill.sh
  - Anthropic skill-development
  - SkillsLLM
  - SkillsBench

Known local findings:

- `skills/showcase/SKILL.md` uses `## Output Language`, while other Skills use `## Output Language Rules`.
- `skills/watchdog/SKILL.md` is internal and intentionally not in the 30 user-command map.
- Stale `/hw:review` V7 compatibility wording remains in multiple docs.

### F003 OpenCode 状态面板

- Add OpenCode TUI plugin support in addition to the existing server plugin scaffold.
- Use files as source of truth and TUI/session events as refresh triggers.
- Sidebar panel should show:
  - Cycle
  - Feature Queue
  - current Feature
  - Milestone list
  - deferred/blocked state
  - recent 10 events
  - work duration, token, and cost summary
- Footer panel should show:
  - current step
  - pipeline progress
  - latest evaluation score
  - latest heartbeat
  - Ask gate / failure state
  - latest event summary
- OpenCode 1.14.30 exposes TUI slots such as `sidebar_content`, `sidebar_footer`, `home_footer`, and session prompt slots through `@opencode-ai/plugin/dist/tui.d.ts`.

### F004 Batch Plan

- Add `.pipeline/feature-queue.yaml`.
- Add `.pipeline/metrics.yaml`.
- Queue stores schedule, state, and metric summaries.
- Metrics file stores detailed Cycle/Feature/Milestone/Step telemetry.
- Default `batch.decompose_mode: upfront`.
- Support `batch.decompose_mode: just_in_time`.
- Default `batch.failure_policy: skip_defer`.
- Preserve existing single-feature `/hw:plan`.
- Add `/hw:plan --batch`.
- Add `/hw:plan --insert` with natural-language queue edits:
  - append
  - insert
  - reprioritize
  - pause
  - replace or adjust Feature description
  - ask for confirmation before applying
- Generate both Markdown tables and Mermaid diagrams for Feature-level architecture and dependency planning.

### F005 项目技术报告与 Beamer Slides

- Write a detailed technical report before slides.
- Audience: lab classmates and teachers.
- Purpose: introduce project motivation, usage, architecture, workflow details, and future design.
- Mainline: combine personal-experience motivation with system-design exposition. Start from the author's AI tool usage path, then expand into Hypo-Workflow as the concrete architecture that answers those problems.
- Proposed chapter order:
  1. Experience and motivation
  2. Constraints in AI-assisted coding
  3. Harness Engineering
  4. Hypo-Workflow architecture
  5. Core mechanisms
  6. V9 OpenCode Native Adapter case study
  7. C2 new design
  8. Live demo route
  9. Limitations and future work
- Include a comparison table across Web GPT/Gemini, Cherry Studio + DeepSeek, GitHub Copilot, AntiGravity, Claude Code, Skills/Superpowers, Notion AI Opus + Codex, and Hypo-Workflow.
- Suggested comparison dimensions: repository visibility, planning ability, context persistence, recoverability, style/behavior solidification, automatic maintenance, and validation loop.
- Opening narrative should start from the author's AI tool usage experience:
  - web GPT/Gemini and Cherry Studio + DeepSeek required excessive prompt description and could not inspect code directly;
  - Copilot was useful for completion but weak for planning, whole-codebase understanding, and style customization;
  - Hypo-LaTeX was initially built through manual prompt stacking and manually maintained project record files;
  - AntiGravity improved some automation but still produced unreliable code and weak requirement handling;
  - Claude Code made conversational feature generation impressive but repeated customization prompts became costly;
  - Skills/Superpowers improved plan-before-build but suffered from limited planning scope and insufficient long-term history;
  - Notion AI Opus plus Codex suggested a strong planning/retrieval + implementation workflow;
  - Hypo-Workflow consolidates these lessons into architecture planning, persistent documents, global record files, audits, hooks, and adapters.
- The core theme is the author's understanding of constraints for AI-assisted development and the relation to Harness Engineering.
- Working definition:
  - Harness Engineering is the practice of building an external engineering constraint system around AI agents: context, plans, state, rules, evaluation, recovery, and collaboration protocols are persisted into files and tools so the model works on an auditable, recoverable, iterative track instead of relying on a single chat turn.
- The report should organize Hypo-Workflow around four mechanism axes:
  - execution loop: plan, execute, audit/evaluate, repair, release, and resume form a closed workflow rather than isolated prompts;
  - layering: Project, Cycle, Feature, Milestone, Patch, Step, and Report separate different scopes and decision levels;
  - behavior solidification: Skills, rules, hooks, templates, and adapters turn repeated prompt constraints into reusable project behavior;
  - automatic maintenance: README, CHANGELOG, progress, logs, metrics, reports, release gates, and future slides/docs are kept fresh by workflow actions.
- Key AI-development constraints to discuss:
  - context management limits and incomplete repository view;
  - repeated manual prompt feeding;
  - plausible but wrong outputs, or the model "convincing itself";
  - inability to persist preferred style and workflow constraints;
  - iteration drift after several optimization rounds;
  - hard interruption, recovery, and auditing for long-running work.
- The report should map those constraints to Hypo-Workflow mechanisms:
  - `state.yaml` for resumable execution state;
  - `PROGRESS.md` and `log.yaml` for durable progress/history;
  - `architecture.md` and Plan Review for architecture intent and drift control;
  - Skills, rules, and hooks for reusable prompts and execution discipline;
  - Cycle, Feature, Milestone, and Patch for scope organization;
  - reports, evaluation scores, regression checks, and release gates for validation loops.
- Include a concrete case study in both the report and slides. Slides should show it in detail and should not avoid dense technical content when the details help the audience understand the system.
- Suggested case study: V9 OpenCode Native Adapter, covering planning, milestone execution, command/adapter mapping, tests, patches, release/archive, and how persistent workflow records preserved context.
- Case-study expectation:
  - show each important implementation detail concretely;
  - use real files, schemas, commands, generated artifacts, and before/after workflow states where possible;
  - connect the details back to execution loop, layering, behavior solidification, and automatic maintenance.
- Include a live demo route in the report and slides. Initial route:
  - `/hw:plan` or `/hw:plan --batch` starts from requirement discovery;
  - Feature Queue shows prioritized features and state;
  - OpenCode sidebar/footer status panel shows current Cycle, Feature, Milestone, recent events, progress, score, duration, tokens, and cost;
  - `/hw:release` runs checks, updates README dynamic sections, and commits release artifacts.
- Final demo route can be refined after implementation confirms exact command behavior and UI surfaces.
- The tone may include direct criticism of Copilot and AntiGravity based on user experience, but the final report should translate most of it into concrete technical limitations: weak planning, incomplete repository context, unstable automation, and high manual steering cost.
- Language: Chinese structure with English technical terms preserved.
- Report target length: about 20-30 pages.
- Slides target length: about 25-35 pages.
- Style: light gray default background with limited dark gray, pale blue, and pale yellow accents.
- Slides should use a classroom technical-report style rather than a business pitch. Every 3-4 slides should form one topic block, using architecture diagrams, flow charts, file structures, screenshots, and real code/config snippets.
- Deliverables:
  - report source/document
  - Beamer `.tex`
  - compiled PDF
  - image/diagram assets
  - README or project documentation links
- GPT Image may generate illustrative assets.
- Technical diagrams should prefer Mermaid, TikZ, or Graphviz for accuracy.
- Future-work topics to cover:
  - pure analysis assistant mode: use the workflow for codebase reading, architecture review, debugging, research, and decision support without necessarily writing code;
  - Workflow generalization beyond software implementation into reusable task workflows, report generation, research workflows, and long-running project operations;
  - richer observability and metrics across duration, tokens, cost, evaluation, drift, queue state, and recovery;
  - stronger cross-platform adapters and shared skill/rule quality standards.

## Metrics Model

Use a split model:

- `.pipeline/feature-queue.yaml`
  - stores Feature plan, status, scheduling, gates, and metrics summary
- `.pipeline/metrics.yaml`
  - stores detailed telemetry by Cycle, Feature, Milestone, and Step

Suggested metrics:

- `duration_seconds`
- `tokens_total`
- `tokens_input`
- `tokens_output`
- `tokens_reasoning`
- `cost`
- `message_count`
- `updated_at`

Cost display:

- Use SDK cost as-is.
- Show `$0.1234` when available.
- Show `n/a` when unavailable.
- Do not infer model pricing.

## Testing Expectations

- Existing core tests must remain green.
- Existing 30 OpenCode command mappings must remain traceable.
- New schemas/rules should have focused regression scenarios.
- OpenCode UI should be validated against available TUI plugin API and generated artifact checks.
- Batch Plan must prove single-feature `/hw:plan` remains unchanged.
- Report/slides should compile to PDF.

## Open Questions

- Technical report narrative and chapter structure still need dedicated interview.
- Exact OpenCode panel layout and refresh cadence remain partially open.
- Feature Queue and Metrics schemas need field-level finalization.
- README regeneration strictness should be encoded in config and release profile behavior.
