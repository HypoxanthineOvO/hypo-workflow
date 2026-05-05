# Glossary

Stable terms extracted from confirmed Discover and Grill-Me decisions.

## Guide Router

A project-aware route recommender that senses lifecycle state and user intent, then recommends exactly one next command path.

Examples:
- A rejected Cycle routes to `/hw:resume`.
- A derived refresh warning routes to `/hw:sync --light`.

Non-examples:
- A separate runner that executes a full workflow by itself.
- A status screen that lists every command without choosing a path.

Common misunderstandings:
- Guide can start the first confirmed command, but it does not bypass that command's own gates.

## Adaptive Grill-Me

A Discover escalation mode that aligns design concepts only when task risk warrants deeper questioning.

Examples:
- Workflow lifecycle semantics or source-of-truth changes enter deep Grill-Me.
- A small copy or bug fix stays in light Discover.

Non-examples:
- A mandatory long questionnaire for every `/hw:plan`.
- Raw conversation copied into every prompt.

Common misunderstandings:
- Deep Grill-Me is about confirmed concepts and boundaries, not about asking more questions for its own sake.

## Design Artifact Layering

A separation of transient discussion, confirmed decisions, glossary/design concepts, architecture, prompt inputs, and Knowledge Ledger indexes.

Examples:
- `.pipeline/design-concepts.yaml` stores machine-readable terms and source-of-truth links.
- `.pipeline/glossary.md` explains terms for humans.
- Knowledge Ledger indexes decisions and references without replacing either file.

Non-examples:
- A monolithic repo-root `CONTEXT.md`.
- Compact summaries acting as design authority.

Common misunderstandings:
- Knowledge Ledger is an index and memory layer; it is not the full glossary or architecture document.
