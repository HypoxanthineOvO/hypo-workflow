# README Spec

本文件定义 `README.md` 的结构、数据来源和更新策略。README 是中文优先入口，英文仅保留在稳定术语、路径、命令、产品名和代码片段中。

## README 结构

README 保留人工维护的叙述，但部分动态区域可由 Hypo-Workflow 管理。推荐结构：

1. 项目标题、badges 和一句话定位。
2. 首屏快速开始：说明 Hypo-Workflow 是什么、如何导入 `HypoxanthineOvO/Hypo-Workflow`、六个平台入口。
3. 主路径 `/hw:init -> /hw:plan -> /hw:start` 和恢复路径 `/hw:status -> /hw:resume`。
4. 平台入口：Codex、Claude Code、OpenCode、Cursor、GitHub Copilot、Trae。
5. 高层工作原则：protected files、Subagents、测试/审查分离、preflight、automation level。
6. 常用命令。
7. 文档入口。
8. 许可证。

长篇内部实现、完整测试矩阵、release 细节和 changelog 应放入 docs 或 references。动态区域必须使用显式 marker；marker 外内容属于用户维护，自动更新路径不得擅自改写。

## Managed Dynamic Blocks

Each block uses this exact marker shape:

```markdown
<!-- HW:README:BEGIN block-name -->
generated content
<!-- HW:README:END block-name -->
```

Required managed blocks:

<!-- HW:README:BEGIN badges -->
Source-backed version, license, and platform badges.
<!-- HW:README:END badges -->

<!-- HW:README:BEGIN feature-summary -->
Capability table and feature summary derived from Skills, references, and
platform adapter metadata.
<!-- HW:README:END feature-summary -->

<!-- HW:README:BEGIN command-count -->
Public command count and internal Skill count.
<!-- HW:README:END command-count -->

<!-- HW:README:BEGIN command-reference -->
Canonical command groups, OpenCode aliases, agents, and Skill paths.
<!-- HW:README:END command-reference -->

<!-- HW:README:BEGIN platform-matrix -->
Codex, Claude Code, OpenCode, Cursor, GitHub Copilot, and Trae capability matrix.
<!-- HW:README:END platform-matrix -->

<!-- HW:README:BEGIN release-summary -->
Release flow summary, validation commands, and publish safety gates.
<!-- HW:README:END release-summary -->

<!-- HW:README:BEGIN version-history -->
Current version, recent release notes, and milestone history summary.
<!-- HW:README:END version-history -->

Optional future blocks may be added with the same prefix. Unknown blocks should
be preserved unless a future spec revision explicitly marks them deprecated.

## 数据来源

| README fact | Primary source | Fallback or validation source |
|---|---|---|
| Project name, marketplace version, description, license | `.claude-plugin/plugin.json` | `.codex-plugin/plugin.json`, `core/package.json` |
| Codex package metadata and interface copy | `.codex-plugin/plugin.json` | `.claude-plugin/plugin.json` |
| Core helper package version | `core/package.json` | `.claude-plugin/plugin.json` |
| Canonical command list and command count | `core/src/commands/index.js` | `references/commands-spec.md`, `references/opencode-command-map.md` |
| OpenCode command aliases, agents, and Skill paths | `references/opencode-command-map.md` | `core/src/commands/index.js` |
| Platform capability matrix | `references/platform-capabilities.md` | `core/src/platform/index.js` |
| Release flow and safety gates | `references/release-spec.md` | `skills/release/SKILL.md` |
| Feature Queue and Batch Plan behavior | `references/feature-queue-spec.md` | `skills/plan/SKILL.md`, `skills/start/SKILL.md` |
| Skill inventory and internal watchdog exception | `skills/` | `core/src/commands/index.js` |
| README narrative and manually maintained prose | `README.md` | Maintainer review |

The updater should prefer structured sources when available. Markdown reference
files may be used as fallbacks for prose summaries, but the renderer should not
scrape arbitrary README text to discover command or platform counts.

## 更新策略

默认行为是 marker-block replacement：

- Replace only content between matching `<!-- HW:README:BEGIN name -->` and
  `<!-- HW:README:END name -->` markers.
- Preserve all text outside managed blocks.
- Preserve unknown managed blocks unless the generator has an explicit renderer
  for that block.
- Fail with a clear freshness error when a required block is missing in strict
  mode.
- In loose local mode, missing markers may create a full-regeneration candidate,
  but the updater must still record why that candidate is safe.

`/hw:release` 的 README 更新顺序：

1. release preflight and regression checks;
2. version calculation;
3. versioned file updates;
4. `update_readme`;
5. changelog generation;
6. final dirty check;
7. commit, tag, push, and remote release gates.

`update_readme` must run before release commit creation and after versioned files
have been updated so the README sees the final version metadata.

## Full Regeneration Policy

Full regeneration is allowed only through profile/config policy. The suggested
configuration keys are:

```yaml
release:
  readme:
    mode: loose # loose | strict
    full_regen: auto # auto | ask | deny
```

Policy matrix:

| mode | full_regen | Behavior |
|---|---|---|
| loose | auto | May regenerate the full README when markers are absent and the original is clearly an English template, stale scaffold, or incompatible pre-spec layout. |
| loose | ask | Summarize the reason and ask before full regeneration. |
| loose | deny | Replace marker blocks only; missing markers become a freshness warning. |
| strict | auto | Treat as `ask` for shared/release profiles. |
| strict | ask | Ask before full regeneration and include a before/after summary. |
| strict | deny | Never regenerate the full README; fail freshness if required markers are absent. |

自动检测旧版 README 时必须保守。只有满足以下至少一项，才可认为存在 full regeneration candidate：

- it has no Hypo-Workflow marker comments;
- it is not 中文优先 while `output.language` is `zh-CN` or `zh`;
- it contains obsolete command counts, platform claims, or version badges that
  conflict with structured sources;
- it looks like an old scaffold with no project-specific manual prose.

When the updater regenerates the full README, it must keep a short decision note
in the release log or report. When the decision is ambiguous, it must ask.

## Freshness Checks

`readme-freshness` should compare the README against structured data sources:

- version badge and release summary match `.claude-plugin/plugin.json`;
- command count matches `core/src/commands/index.js`;
- OpenCode command table remains traceable to `references/opencode-command-map.md`;
- platform matrix mentions Codex, Claude Code, OpenCode, Cursor, GitHub Copilot, and Trae consistently with
  `references/platform-capabilities.md` and `core/src/platform/index.js`;
- Chinese Quick Start includes `HypoxanthineOvO/Hypo-Workflow`, `/hw:init -> /hw:plan -> /hw:start`, and `/hw:status -> /hw:resume`;
- README mentions Subagents and testing/review separation at a product-guidance level without external model routing for Codex Subagents;
- Skill count and internal watchdog wording stay consistent with `skills/`;
- release flow summary mentions regression, version update, changelog, commit,
  tag, push, and confirmation gates according to `references/release-spec.md`.

Freshness failures should be surfaced before release commit creation. In strict
mode, release should stop. In loose mode, the updater may repair managed blocks
and continue when no user-owned prose is at risk.

## 实现说明

README 生成 helper 应集中处理结构化数据，不要把字符串拼接散落在 release command 逻辑里。

Recommended helper responsibilities:

- load structured metadata from plugin JSON files, command map, platform
  capability map, and release spec;
- render each managed block independently;
- replace marker blocks atomically;
- detect missing marker policy from `release.readme.mode` and
  `release.readme.full_regen`;
- provide a dry-run/freshness check path for pre-release validation;
- return a machine-readable summary with changed blocks, warnings, and whether
  full regeneration was used.

The helper should be covered by fixture tests. M02 may update `README.md` through
the new helper only after the marker and full-regeneration policy is enforced.
