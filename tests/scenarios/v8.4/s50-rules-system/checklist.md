# System Test Checklist: s50-rules-system

- Scenario: `s50-rules-system`
- Goal: Verify V8.4 Rules assets, command registration, schema, and SessionStart integration.

## Checks

- [ ] `/hw:rules` is registered in root command routing and help references.
- [ ] Built-in rules and presets exist.
- [ ] `scripts/rules-summary.sh` lists effective rules and active always rules.
- [ ] SessionStart injects Rules Context.
- [ ] README and config schema document Rules.
