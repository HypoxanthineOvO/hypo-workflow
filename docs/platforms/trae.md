# Trae Guide

Commands: repository-instructions.
Ask gates: chat.
Plan support: host-dependent.

Hypo-Workflow does not run project work itself; the host agent performs the work using `.pipeline/` files.

## Repository Instructions

Adapter target: `.trae/rules/project_rules.md`.

These adapters are repository instruction files. They tell the host IDE Agent to read `HypoxanthineOvO/Hypo-Workflow` and follow README Quick Start guidance; they do not provide native Hook or lifecycle enforcement.

Keep protected files guarded, run preflight checks before completion, and keep implementation separate from testing/review when the host supports delegated work.
