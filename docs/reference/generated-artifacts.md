# Generated Artifacts Reference

| Artifact | Source | Repair |
|---|---|---|
| `.opencode/commands/hw-*.md` | command registry | `/hw:sync` |
| `.opencode/agents/hw-*.md` | OpenCode artifact helper | `/hw:sync` |
| `.cursor/rules/hypo-workflow.mdc` | third-party adapter helper | `/hw:sync --platform cursor` |
| `.github/copilot-instructions.md` | third-party adapter helper | `/hw:sync --platform copilot` |
| `.trae/rules/project_rules.md` | third-party adapter helper | `/hw:sync --platform trae` |
| `.pipeline/*.compact.*` | `.pipeline/` authority files | `/hw:sync --repair` |
| `docs/reference/*.md` | docs map | `/hw:docs repair` |
| README managed blocks | command/platform helpers | `/hw:docs repair` |
