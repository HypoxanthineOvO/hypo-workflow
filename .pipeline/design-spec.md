# V2 Design Spec — Notion Adapter

## Goal

Add a Notion adapter to Hypo-Workflow so prompts can be read from Notion and reports can be written back to Notion.

## Project Shape

- Project type: skill bundle with helper scripts
- Primary deliverable: adapter docs + helper scripts + config/schema updates + regression coverage
- Target platform: Claude Code and Codex
- Expected users: agents running Hypo-Workflow with local or Notion-backed planning artifacts

## Constraints

- The current repo is file-first and markdown-driven
- Existing V0-V5 behavior must remain backward compatible
- Notion API access currently authenticates successfully, but no existing pages are visible to the integration
- Internal integration cannot create workspace-root private pages without a shared parent page

## Existing Context

- Existing repo detected: yes
- Existing `.pipeline/` detected: yes, repurposed for this V2 dogfooding run
- Current adapters: only `adapters/source/local.md` and `adapters/output/local.md`
- Existing helper scripts: validation, diff, state summary, log append
- Existing config validation shell already accepts `local|notion`, but schema is still local-only

## Functional Requirements

- `pipeline.source: notion` should read prompts from Notion
- `pipeline.output: notion` should write reports to Notion
- mixed mode must work:
  - `source: local` + `output: notion`
  - `source: notion` + `output: local`
- config must support:
  - `notion.token_file`
  - `notion.source_database_id`
  - `notion.source_page_id`
  - `notion.output_parent_page_id`
  - `notion.output_database_id`
  - env fallback `NOTION_TOKEN`

## Testing Expectations

- auth smoke should hit `users/me`
- source adapter tests should validate page/database parsing
- output adapter tests should validate block generation and upsert behavior
- live Notion write tests should degrade gracefully when no shared parent page is available
- full regression `s01-s18` must remain green

## Milestone Strategy

- M0: schema + adapter contract + planning scaffold
- M1: source adapter scripts + docs
- M2: output adapter scripts + docs
- M3: mixed mode + tests + docs + Notion reporting

## Open Questions

- Should future versions add Notion database schema bootstrap helpers?
- Should report upsert prefer page title matching or explicit page id pinning?

## Notes

- Decision: because the integration cannot currently see the existing Hypo-Workflow pages, V2 will implement graceful degradation and use live auth smoke plus offline/conditional API tests.
