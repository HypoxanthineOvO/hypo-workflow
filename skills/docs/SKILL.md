---
name: docs
description: Generate, check, repair, and synchronize Hypo-Workflow documentation without hiding documentation governance inside sync or release.
---

# /hw:docs

Use this skill when the user invokes `/hw:docs` or asks to generate, check, repair, or sync documentation.

## Output Language Rules

Follow the root Hypo-Workflow output language config. Use Chinese for user-facing output when `output.language` is `zh-CN` or `zh`, English when it is `en`, and follow the conversation language when it is `auto`.

## Forms

- `/hw:docs check`
- `/hw:docs repair`
- `/hw:docs generate`
- `/hw:docs sync`

## Contract

Documentation ownership is explicit:

- README is a concise user entrypoint.
- `docs/user-guide.md` is the full user guide.
- `docs/developer.md` is the developer guide.
- `docs/platforms/*.md` are platform guides.
- `docs/reference/*.md` are generated references.
- `CHANGELOG.md` belongs to release.
- `LICENSE` is manual authority; if absent, report the gap.

## Update Classes

- Managed README blocks may be updated automatically.
- Generated references may be regenerated.
- Narrative docs require explicit `repair` or confirmation.

## Safety

- Do not make README a developer test checklist.
- Do not silently rewrite narrative docs from `/hw:sync` or `/hw:release`.
- Release must fact-check narrative docs for stale command counts and false platform claims.

## Reference Files

- `references/commands-spec.md`
- `references/release-spec.md`
- `references/platform-capabilities.md`
- `templates/readme-spec.md`
