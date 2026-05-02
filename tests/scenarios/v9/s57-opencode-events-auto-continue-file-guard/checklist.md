# s57 — OpenCode Events, Auto Continue, Context, File Guard

Validate plugin event policy behavior scaffolding and generated runtime helpers.

- Plugin template includes command context recording.
- Safe auto-continue policy exists in generated runtime helpers with ask/safe/aggressive modes.
- Compact context restore references state/progress/cycle/rules/patch.
- Protected file writes are denied.
- Knowledge Ledger and Explore worktree paths are explicitly allowed.
- `~/.hypo-workflow/secrets.yaml` is denied.
- Ordinary `.pipeline` writes warn.
- Permission asked/replied events are logged.
