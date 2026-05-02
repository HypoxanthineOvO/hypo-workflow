# M03 / F001 - Knowledge Hook Integration

## 需求

- Integrate Knowledge Ledger with SessionStart, Stop/post-step behavior, Patch completion, and Cycle archive flow.
- SessionStart should load only knowledge compact plus index.
- Stop/post-step behavior should require the Agent to self-check whether knowledge should be written; strict mode may require it.
- Cycle archive should include a Cycle-level knowledge summary.

## 实施计划

1. Extend `hooks/session-start.sh` to append:
   - `.pipeline/knowledge/knowledge.compact.md`
   - selected files under `.pipeline/knowledge/index/`
2. Add a small helper script if needed for shell-safe compact/index discovery.
3. Extend Stop Hook guidance:
   - when a milestone, patch, release, sync, or explore session materially changes knowledge, require a ledger record
   - default behavior can warn, strict behavior can block
4. Update rules:
   - add or extend hook rules for knowledge ledger self-check
   - ensure always-rules mention the knowledge context boundary
5. Update Cycle archive rules:
   - generate `archives/Cx-slug/knowledge-summary.md`
   - do not move the persistent `.pipeline/knowledge/` directory
6. Update compact rules so knowledge compact can be regenerated alongside other compact files.

## 预期测试

- Hook tests proving SessionStart injects compact plus index.
- Stop Hook tests for required/warn behavior.
- Archive fixture test for `knowledge-summary.md`.
- Compact tests proving full raw records are not loaded by default.

## 预期产出

- updates to `hooks/session-start.sh`
- updates to `hooks/stop-check.sh`
- updates to `skills/cycle/SKILL.md`
- updates to `skills/compact/SKILL.md`
- updates to rules/spec/tests

## 约束

- Keep hook scripts fast and dependency-light.
- Do not read raw knowledge records into SessionStart unless explicitly requested.
- Preserve existing chat recovery behavior.
