# OpenCode Adapter Scaffold

This directory contains the OpenCode-native adapter templates for Hypo-Workflow V9.

The plugin is an adapter layer, not an autonomous worker. It provides:

- command context capture
- file guard policy
- compact context hints
- heartbeat/event bridges
- safe auto-continue signals

It does not implement business tasks, generate reports on its own, or run the pipeline outside the host Agent.
