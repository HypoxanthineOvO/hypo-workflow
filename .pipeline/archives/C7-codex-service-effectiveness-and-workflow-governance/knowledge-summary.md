# Knowledge Compact

Generated from `.pipeline/knowledge/records/*.yaml`. Raw records are loaded only on demand.

## Dependencies
- C6-SYNC-claude-opencode-codex-interface-map-20260505 (C6-claude-opencode-codex-interface-map): Claude Code / OpenCode / Codex interface map for adapter planning - Claude Code hooks
- C4-M05-f001-knowledge-and-opencode-integration-gate-18c2eaab (C4/M05): F001 Knowledge and OpenCode integration gate - core/src/knowledge/index.js

## References
- C6-SYNC-claude-opencode-codex-interface-map-20260505 (C6-claude-opencode-codex-interface-map): Claude Code / OpenCode / Codex interface map for adapter planning - Claude Code plugins
- C4-M05-f001-knowledge-and-opencode-integration-gate-18c2eaab (C4/M05): F001 Knowledge and OpenCode integration gate - Knowledge Ledger Spec

## Pitfalls
- C6-SYNC-claude-opencode-codex-interface-map-20260505 (C6-claude-opencode-codex-interface-map): Claude Code / OpenCode / Codex interface map for adapter planning - Claude Code hook outputs are event-sensitive and exit-code-sensitive.
- C4-M05-f001-knowledge-and-opencode-integration-gate-18c2eaab (C4/M05): F001 Knowledge and OpenCode integration gate - State advanced to M05 while prompt_state still described M04

## Decisions
- C6-SYNC-claude-opencode-codex-interface-map-20260505 (C6-claude-opencode-codex-interface-map): Claude Code / OpenCode / Codex interface map for adapter planning - Seed Knowledge with an interface map first
- C4-M05-f001-knowledge-and-opencode-integration-gate-18c2eaab (C4/M05): F001 Knowledge and OpenCode integration gate - Gate records prove reusable project knowledge before leaving F001

## Config Notes
- C6-SYNC-claude-opencode-codex-interface-map-20260505 (C6-claude-opencode-codex-interface-map): Claude Code / OpenCode / Codex interface map for adapter planning - claude_code.settings.paths
- C4-M05-f001-knowledge-and-opencode-integration-gate-18c2eaab (C4/M05): F001 Knowledge and OpenCode integration gate - knowledge.loading.records

## Secret Refs
- n/a
