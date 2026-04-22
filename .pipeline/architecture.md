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
