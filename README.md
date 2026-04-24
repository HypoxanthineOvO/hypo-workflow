# Hypo-Workflow

Hypo-Workflow is a serialized prompt execution engine for AI agents. The actual package lives in [`prompt-pipeline/`](./prompt-pipeline), which contains the canonical [`SKILL.md`](./prompt-pipeline/SKILL.md), plugin manifests, tests, and detailed documentation.

## Install

### Claude Code

```bash
/plugin marketplace add HypoxanthineOvO/hypo-workflow
/plugin install hypo-workflow@hypoxanthine-hypo-workflow

# Verify:
/hw:help
```

The repository marketplace is published from [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json), which points Claude Code at [`prompt-pipeline/`](./prompt-pipeline).

### Codex CLI

The repository ships Codex plugin metadata and marketplace metadata, but the most reliable current install path is still the built-in skill installer against the package directory that already contains the full skill:

```text
Use $skill-installer to install https://github.com/HypoxanthineOvO/hypo-workflow/tree/main/prompt-pipeline as skill name hypo-workflow

# Then restart Codex and verify:
/hw:help
```

### Manual

```bash
git clone https://github.com/HypoxanthineOvO/hypo-workflow.git
claude --plugin-dir ./hypo-workflow/prompt-pipeline
```

## Docs

- Full package docs: [prompt-pipeline/README.md](./prompt-pipeline/README.md)
- Main skill entry: [prompt-pipeline/SKILL.md](./prompt-pipeline/SKILL.md)
- Claude marketplace file: [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json)
- Codex marketplace file: [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json)
