# M08 / F002 - Model Pool And Project Actions

## 需求

- Complete useful global TUI actions:
  - edit model pool and fallback chains
  - map role model settings to OpenCode agent matrix
  - add a project
  - scan for projects
  - sync selected project
  - display acceptance and knowledge status

## 实施计划

1. Implement model pool editing UI:
   - Plan
   - Implement
   - Review
   - Evaluate
   - Chat
2. Implement fallback-chain editing and validation.
3. Add save flow with lazy migration backup.
4. Add project actions:
   - add path
   - scan directory
   - refresh registry
   - run standard sync
5. Ensure OpenCode sync renders model matrix correctly from unified roles.
6. Surface knowledge and acceptance status in project detail.

## 预期测试

- Config roundtrip tests for model pool edits.
- Role-to-agent matrix tests.
- Project registry action tests.
- OpenCode artifact sync tests.
- Manual TUI smoke for editing and saving.

## 预期产出

- TUI editing screens
- model pool mapping helpers
- updated sync logic
- docs and smoke checklist

## 约束

- Do not duplicate model config systems.
- Project-local config remains able to override global defaults.
- Keep write operations explicit and reversible where possible.
