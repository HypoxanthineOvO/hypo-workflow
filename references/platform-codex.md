# Platform Guide: Codex CLI

Use this reference when the pipeline runs inside Codex CLI.

## Environment Shape

- There is no full Claude-style plugin system.
- `notify` is the only hook-like primitive and it fires at agent-turn completion.
- Discipline is usually carried by `AGENTS.md` and the skill itself.
- Experimental subagent definitions may live in `.codex/agents/`.

## Practical Implications

- Do not rely on SessionStart or SessionStop hooks.
- Keep state transitions explicit inside `SKILL.md`.
- Treat background notifications as optional observability, not control flow.

## Hook 降级说明

Codex CLI 仅支持 `notify` 配置（agent-turn-complete 事件）。
无 SessionStart / Stop / InstructionsLoaded 等事件。

Pipeline 纪律完全依赖 `SKILL.md` 内部逻辑（与 V1 行为一致）。

### notify 配置（可选）

`.codex/config.toml`:

```toml
notify = ["bash", "hooks/codex-notify.sh"]
```

### AGENTS.md 纪律条款（建议）

在项目根目录的 `AGENTS.md` 中加入：

```markdown
## Hypo-Workflow Pipeline 约束
- 每完成一个步骤必须更新 .pipeline/state.yaml
- 每完成一个步骤必须在 .pipeline/log.md 追加记录
- Pipeline 未完成时不得停止
- 最后一步必须生成报告
```

## Subagent Paths

Preferred order:

1. `codex exec` for explicit delegation
2. experimental `.codex/agents/` conventions when available
3. self execution fallback

## Recommended Project Guardrails

Use `AGENTS.md` to restate:

- required commands
- logging expectations
- state persistence rules
- escalation behavior

This is the Codex equivalent of relying on hook-enforced discipline.

## Degradation Model

Codex should always assume:

- no guaranteed hook lifecycle
- subagent execution may fail or return partial stderr noise
- the pipeline must remain recoverable through `state.yaml` alone
