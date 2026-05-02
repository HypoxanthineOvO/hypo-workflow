# M02 / F001 - Knowledge Helpers And Compact Index

## 需求

- Implement deterministic Knowledge Ledger helpers in `core/`.
- Support appending structured session records, redacting sensitive fields, rebuilding category indexes, and rendering compact context.
- Keep the helper API reusable by CLI, hooks, `/hw:knowledge`, and OpenCode plugin code.

## 实施计划

1. Add a `core/src/knowledge/` module and export it from `core/src/index.js`.
2. Implement record normalization:
   - assign IDs
   - normalize source refs such as `C4/M01`, `P006`, `E001`
   - normalize categories and tags
   - redact sensitive values
3. Implement append helpers that write under `.pipeline/knowledge/records/`.
4. Implement index generation:
   - dependencies
   - references
   - pitfalls
   - decisions
   - config notes
   - secret refs
5. Implement compact rendering for `knowledge.compact.md`.
6. Keep generated indexes deterministic and stable for tests.

## 预期测试

- Unit tests for record normalization.
- Unit tests for redaction.
- Fixture tests for each category index.
- Compact rendering tests with line-count or content expectations.
- Regression that full record details stay out of `state.yaml`.

## 预期产出

- `core/src/knowledge/index.js`
- `core/test/knowledge-ledger.test.js`
- fixture records under `core/test/fixtures/knowledge/` if useful
- exports from `core/src/index.js`

## 约束

- Use existing project JS style and zero unnecessary runtime dependencies.
- Keep YAML handling compatible with the repo's lightweight parser unless a local pattern justifies a stronger parser.
- Do not mutate unrelated `.pipeline` files while generating indexes.
