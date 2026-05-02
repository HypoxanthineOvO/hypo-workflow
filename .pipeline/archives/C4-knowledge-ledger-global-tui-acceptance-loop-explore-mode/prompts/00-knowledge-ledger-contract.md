# M01 / F001 - Knowledge Ledger Contract

## 需求

- Define the Knowledge Ledger contract for `.pipeline/knowledge/` before implementation work starts.
- Specify raw session records, generated category indexes, compact summaries, secret references, and Cycle archive summaries.
- Add or update command and Skill specs for `/hw:knowledge`.
- Add config/spec defaults for knowledge loading, compaction, redaction, and strictness.
- Keep `state.yaml` compact. Do not store full knowledge records in runtime state.

## 实施计划

1. Read current contracts: `references/state-contract.md`, `references/config-spec.md`, `references/commands-spec.md`, `skills/compact/SKILL.md`, `skills/rules/SKILL.md`, and hook scripts.
2. Design `.pipeline/knowledge/` layout:
   - `records/*.yaml`
   - `index/dependencies.yaml`
   - `index/references.yaml`
   - `index/pitfalls.yaml`
   - `index/decisions.yaml`
   - `index/config-notes.yaml`
   - `index/secret-refs.yaml`
   - `knowledge.compact.md`
3. Define session record fields for milestone, patch, chat, explore, release, and sync events.
4. Define secret handling:
   - real values only in `~/.hypo-workflow/secrets.yaml`
   - repo records may store env var names, provider names, and redacted values
   - redaction for `api_key`, `token`, `secret`, `password`, `authorization`, and similar fields
5. Add `/hw:knowledge` command semantics:
   - list
   - view
   - compact
   - index
   - search/filter by category/tag/source
6. Update OpenCode command map expectations but keep implementation for later milestones.

## 预期测试

- Add fixture tests for valid knowledge record shapes.
- Add redaction tests for common secret field names.
- Add command-map tests proving `/hw:knowledge` is recognized after implementation.
- Add docs/spec tests ensuring SessionStart loads compact plus index only.

## 预期产出

- `references/knowledge-spec.md`
- `skills/knowledge/SKILL.md`
- updates to `references/commands-spec.md`
- updates to `references/config-spec.md`
- updates to `SKILL.md`
- updates to command map tests or fixtures as needed

## 约束

- Do not implement full hook behavior in this milestone.
- Do not write API key values into `.pipeline/`.
- Do not make Knowledge Ledger a runner-owned memory service.
