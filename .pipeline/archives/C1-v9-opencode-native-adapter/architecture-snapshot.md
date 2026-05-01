# Architecture Baseline — V2 Notion Adapter

## Current Baseline

- Source adapters: local only
- Output adapters: local only
- Config schema: pipeline source/output still schema-limited to local
- Validation shell: already notion-aware for source/output enum values
- No shared Notion pages are currently visible to the integration token

## Planned Changes

### ADDED

- `adapters/source/notion.md`
- `adapters/output/notion.md`
- Notion helper scripts for read/write/auth flows
- Notion adapter tests and fixtures

### CHANGED

- `config.schema.yaml`
- `SKILL.md`
- `README.md`

### REASON

- Add Notion-backed prompt input and report output without breaking local mode

### IMPACT

- Mixed mode becomes first-class
- Validation needs to understand Notion config
- Live tests must degrade gracefully when the integration lacks shared parent pages

## Review History

### Milestone M0 / Prompt 00-auth-and-contract

#### ADDED

- Notion config schema fields
- `adapters/source/notion.md`
- `adapters/output/notion.md`
- `scripts/notion_api.py` auth/search scaffold

#### CHANGED

- `.pipeline/` planning workspace now targets V2 instead of the earlier V5 self-bootstrap run

#### REASON

- The repo needed a real V2 planning/execution loop to dogfood Plan Mode a second time

#### IMPACT

- Later milestones can build source/output logic on top of a shared Notion helper
- No downstream prompt rewrite required

### Milestone M1 / Prompt 01-source-adapter

#### ADDED

- fixture-based source adapter tests
- database and page parsing flow in `scripts/notion_api.py`

#### CHANGED

- Notion source adapter moved from contract-only to executable helper behavior

#### REASON

- Live page access is not available, so parser correctness needed fixture coverage

#### IMPACT

- Output adapter can reuse the same helper module patterns
- Mixed mode tests should cover local/notion independence explicitly

### Milestone M2 / Prompt 02-output-adapter

#### ADDED

- Markdown to Notion block rendering
- report upsert helper with dry-run mode
- output adapter tests

#### CHANGED

- Notion helper now spans auth, search, source parsing, render, and upsert surfaces

#### REASON

- The adapter needed an executable write path even before live page access became available

#### IMPACT

- Final milestone must clarify graceful degradation and version/docs changes
- Existing prompts remain valid

### Milestone M3 / Prompt 03-mixed-mode-and-integration

#### ADDED

- mixed mode validation tests
- integration smoke test for auth + empty search degradation

#### CHANGED

- public docs and skill metadata now declare Notion support
- plugin version advances to `5.1.0`

#### REASON

- V2 is only complete once the public contract, validation, and release version agree

#### IMPACT

- existing regression scenarios remain green
- writing to the real V2 Report page still depends on page-sharing permissions in Notion
