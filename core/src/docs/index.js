import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { CANONICAL_COMMANDS } from "../commands/index.js";
import { PLATFORM_CAPABILITIES } from "../platform/index.js";
import {
  checkReadmeFreshness,
  updateReadme,
} from "../readme/index.js";

export function docsMap() {
  return {
    version: 1,
    documents: [
      {
        path: "README.md",
        role: "concise_user_entrypoint",
        update_class: "managed_blocks_plus_narrative",
        sources: ["core/src/commands/index.js", "core/src/platform/index.js", "LICENSE"],
        managed_blocks: ["badges", "feature-summary", "command-count", "command-reference", "platform-matrix"],
        narrative_update_policy: "explicit_repair",
        must_not_include: ["full_test_matrix", "release_internals", "adapter_runtime_details", "long_changelog"],
      },
      {
        path: "docs/user-guide.md",
        role: "full_user_guide",
        update_class: "narrative_doc",
        sources: ["README.md", "references/commands-spec.md"],
        managed_blocks: [],
        narrative_update_policy: "explicit_repair",
        must_not_include: ["internal_architecture_dump"],
      },
      {
        path: "docs/developer.md",
        role: "developer_guide",
        update_class: "narrative_doc",
        sources: ["references/*.md", "core/src"],
        managed_blocks: [],
        narrative_update_policy: "explicit_repair",
        must_not_include: [],
      },
      ...["codex", "claude-code", "opencode", "cursor", "copilot", "trae"].map((platform) => ({
        path: `docs/platforms/${platform}.md`,
        role: "platform_guide",
        platform,
        update_class: "narrative_doc",
        sources: ["references/platform-capabilities.md", "core/src/platform/index.js"],
        managed_blocks: [],
        narrative_update_policy: "explicit_repair",
        must_not_include: [],
      })),
      {
        path: "docs/reference/commands.md",
        role: "generated_command_reference",
        update_class: "generated_reference",
        sources: ["core/src/commands/index.js"],
        managed_blocks: [],
        narrative_update_policy: "generated",
        must_not_include: [],
      },
      {
        path: "docs/reference/platforms.md",
        role: "generated_platform_reference",
        update_class: "generated_reference",
        sources: ["core/src/platform/index.js"],
        managed_blocks: [],
        narrative_update_policy: "generated",
        must_not_include: [],
      },
      {
        path: "docs/reference/generated-artifacts.md",
        role: "generated_artifacts_reference",
        update_class: "generated_reference",
        sources: ["core/src/artifacts/opencode.js", "core/src/artifacts/third-party.js", "core/src/sync/index.js"],
        managed_blocks: [],
        narrative_update_policy: "generated",
        must_not_include: [],
      },
      {
        path: "CHANGELOG.md",
        role: "changelog",
        update_class: "release_generated",
        sources: ["git log"],
        managed_blocks: [],
        narrative_update_policy: "release_flow",
        must_not_include: [],
      },
      {
        path: "LICENSE",
        role: "license",
        update_class: "authority",
        sources: [],
        managed_blocks: [],
        narrative_update_policy: "manual",
        must_not_include: [],
      },
    ],
  };
}

export async function checkDocs(projectRoot = ".", options = {}) {
  const failures = [];
  const warnings = [];
  const readmePath = join(projectRoot, "README.md");
  const readme = await readOptionalText(readmePath);
  if (!readme) {
    failures.push({ check: "readme", message: "README.md is missing" });
  } else {
    failures.push(...checkReadmeNarrative(readme));
    const freshness = await checkReadmeFreshness(readmePath, { projectRoot }).catch((error) => ({
      fresh: false,
      failures: [{ check: "readme-freshness", message: error.message }],
    }));
    failures.push(...freshness.failures);
    if (!/\]\(LICENSE\)|License|许可证/i.test(readme)) {
      failures.push({ check: "license-link", message: "README must link to or clearly mention LICENSE" });
    }
  }
  for (const doc of docsMap().documents.filter((item) => item.update_class === "generated_reference")) {
    const content = await readOptionalText(join(projectRoot, doc.path));
    if (!content) warnings.push({ check: "generated-reference-missing", path: doc.path });
  }
  return {
    ok: failures.length === 0,
    failures,
    warnings,
  };
}

export async function repairDocs(projectRoot = ".", options = {}) {
  const generated = [];
  const managedBlocks = [];
  const write = options.write !== false;
  await writeGenerated(projectRoot, "docs/user-guide.md", renderUserGuide());
  generated.push("docs/user-guide.md");
  await writeGenerated(projectRoot, "docs/developer.md", renderDeveloperGuide());
  generated.push("docs/developer.md");
  for (const platform of ["codex", "claude-code", "opencode", "cursor", "copilot", "trae"]) {
    const path = `docs/platforms/${platform}.md`;
    await writeGenerated(projectRoot, path, renderPlatformGuide(platform));
    generated.push(path);
  }
  await writeGenerated(projectRoot, "docs/reference/commands.md", renderCommandsReference());
  generated.push("docs/reference/commands.md");
  await writeGenerated(projectRoot, "docs/reference/platforms.md", renderPlatformsReference());
  generated.push("docs/reference/platforms.md");
  await writeGenerated(projectRoot, "docs/reference/generated-artifacts.md", renderGeneratedArtifactsReference());
  generated.push("docs/reference/generated-artifacts.md");

  const readmePath = join(projectRoot, "README.md");
  if (await readOptionalText(readmePath)) {
    const result = await updateReadme(readmePath, {
      blocks: ["command-count", "command-reference", "platform-matrix"],
      write,
    });
    managedBlocks.push(...result.changedBlocks);
  }

  return {
    generated,
    managed_blocks: managedBlocks,
    narrative_rewritten: false,
  };
}

export async function checkNarrativeDocsForRelease(projectRoot = ".") {
  const failures = [];
  for (const file of ["README.md", "docs/user-guide.md", "docs/developer.md"]) {
    const content = await readOptionalText(join(projectRoot, file));
    if (!content) continue;
    const countMatch = /\b(\d+)\s+(?:commands|command)|(\d+)\s*个用户指令/i.exec(content);
    const count = Number(countMatch?.[1] || countMatch?.[2] || NaN);
    if (Number.isFinite(count) && count !== userCommandCount()) {
      failures.push({ check: "stale-command-count", path: file, expected: userCommandCount(), actual: count });
    }
    if (/no\s+OpenCode\s+support|不支持\s*OpenCode/i.test(content)) {
      failures.push({ check: "stale-platform-claim", path: file, expected: "OpenCode supported" });
    }
  }
  return {
    ok: failures.length === 0,
    failures,
  };
}

function checkReadmeNarrative(readme) {
  const failures = [];
  const checks = [
    ["full_test_matrix", /full test matrix|完整测试矩阵/i],
    ["release_internals", /git tag|git push|release commit|发布内部/i],
    ["adapter_runtime_details", /adapter runtime details|runtime hook implementation|适配器运行时细节/i],
    ["long_changelog", /## v\d+\.\d+\.\d+[\s\S]*## v\d+\.\d+\.\d+/i],
  ];
  for (const [name, pattern] of checks) {
    if (pattern.test(readme)) {
      failures.push({ check: "readme-must-not-include", item: name, message: `README includes ${name}` });
    }
  }
  return failures;
}

function renderUserGuide() {
  return [
    "# User Guide",
    "",
    "Hypo-Workflow organizes long-running AI coding work around `.pipeline/` state, prompts, reports, logs, and recovery files.",
    "",
    "## Common Workflows",
    "",
    "- Plan work with `/hw:plan`, then execute with `/hw:start` or `/hw:resume`.",
    "- Check progress with `/hw:status` and inspect reports with `/hw:report`.",
    "- Repair derived context with `/hw:sync --repair` and documentation with `/hw:docs repair`.",
    "- Use `/hw:accept` or `/hw:reject` at lifecycle gates.",
    "",
    "## Feature Queue",
    "",
    "Feature Queue supports long-range planning without turning Hypo-Workflow into a runner.",
    "",
    "- Use `/hw:plan --batch` to discover multiple Features and create a queue.",
    "- Use `/hw:plan --insert` to stage a natural-language queue edit before confirmation.",
    "- `.pipeline/feature-queue.yaml` stores Features, dependencies, gates, and scheduling metadata.",
    "- `.pipeline/metrics.yaml` stores duration, token, cost, and telemetry fallback summaries.",
    "- `upfront` decomposition writes milestones for the whole queue early.",
    "- `just_in_time` decomposition materializes milestones when a Feature becomes current.",
    "- `gate: confirm` pauses before work that requires explicit human review.",
    "- `auto_chain` can advance ready Features when gates and failure policy allow it.",
    "- `failure_policy: skip_defer` defers failed Features instead of blocking the whole queue.",
    "",
    "## Recovery",
    "",
    "Structured execution leases and lifecycle logs preserve enough context for safe resume or handoff across supported platforms.",
  ].join("\n") + "\n";
}

function renderDeveloperGuide() {
  return [
    "# Developer Guide",
    "",
    "Core helpers live under `core/src/` and are shared by CLI, skills, OpenCode artifacts, and tests.",
    "",
    "## Contracts",
    "",
    "- `.pipeline/` remains the source of truth.",
    "- Generated adapters are derived artifacts.",
    "- Protected lifecycle authority files require explicit lifecycle commit paths.",
  ].join("\n") + "\n";
}

function renderPlatformGuide(platform) {
  const title = platformTitle(platform);
  const capability = PLATFORM_CAPABILITIES[platform] || {};
  const base = [
    `# ${title} Guide`,
    "",
    `Commands: ${capability.commands || "supported"}.`,
    `Ask gates: ${capability.ask || "supported"}.`,
    `Plan support: ${capability.plan || "supported"}.`,
    "",
    "Hypo-Workflow does not run project work itself; the host agent performs the work using `.pipeline/` files.",
  ];

  if (["cursor", "copilot", "trae"].includes(platform)) {
    base.push(
      "",
      "## Repository Instructions",
      "",
      `Adapter target: \`${capability.adapter_target || capability.rules}\`.`,
      "",
      "These adapters are repository instruction files. They tell the host IDE Agent to read `HypoxanthineOvO/Hypo-Workflow` and follow README Quick Start guidance; they do not provide native Hook or lifecycle enforcement.",
      "",
      "Keep protected files guarded, run preflight checks before completion, and keep implementation separate from testing/review when the host supports delegated work.",
    );
  }

  if (platform === "claude-code") {
    base.push(
      "",
      "## Plugin Namespace",
      "",
      "The Claude Code plugin name is intentionally `hw`, so existing workflow skills surface as `/hw:*` commands.",
      "",
      "- The adapter uses the root `skills/` directory and existing workflow skills.",
      "- It does not generate `skills/hw-*` alias skills.",
      "- Settings are merged through project-local `settings.local_file` policy.",
      "- DeepSeek and Mimo may be used through Claude Code agent routing when configured; this is separate from Codex Subagents.",
    );
  }

  if (platform === "opencode") {
    base.push(
      "",
      "## Model Matrix",
      "",
      "OpenCode 负责实际模型调用；Hypo-Workflow only writes role-aware agent metadata and config defaults.",
      "",
      "```yaml",
      "opencode:",
      "  compaction:",
      "    effective_context_target: 900000",
      "  agents:",
      "    plan:",
      "      model: gpt-5.5",
      "    compact:",
      "      model: deepseek-v4-flash",
      "    test:",
      "      model: deepseek-v4-pro",
      "    code-a:",
      "      model: mimo-v2.5-pro",
      "    code-b:",
      "      model: deepseek-v4-pro",
      "    debug:",
      "      model: gpt-5.5",
      "    docs:",
      "      model: deepseek-v4-pro",
      "    report:",
      "      model: deepseek-v4-flash",
      "```",
      "",
      "| Agent | Role | 发布默认 |",
      "|---|---|---|",
      "| `hw-compact` | context compaction | `deepseek-v4-flash` |",
      "| `hw-test` | test design and validation | `deepseek-v4-pro` |",
      "| `hw-code-a` | primary implementation | `mimo-v2.5-pro` |",
      "| `hw-code-b` | secondary implementation | `deepseek-v4-pro` |",
      "| `hw-docs` | documentation and release notes | `deepseek-v4-pro` |",
      "| `hw-report` | report synthesis | `deepseek-v4-flash` |",
    );
  }

  return base.join("\n") + "\n";
}

function platformTitle(platform) {
  if (platform === "claude-code") return "Claude Code";
  if (platform === "opencode") return "OpenCode";
  if (platform === "cursor") return "Cursor";
  if (platform === "copilot") return "GitHub Copilot";
  if (platform === "trae") return "Trae";
  return "Codex";
}

function renderCommandsReference() {
  const rows = CANONICAL_COMMANDS.map((command) => (
    `| \`${command.canonical}\` | \`${command.opencode}\` | \`${command.agent}\` | \`${command.skill}\` |`
  ));
  return [
    "# Commands Reference",
    "",
    `Generated from \`core/src/commands/index.js\`. Current user command count: ${userCommandCount()}.`,
    "",
    "| Canonical | OpenCode | Agent | Skill |",
    "|---|---|---|---|",
    ...rows,
  ].join("\n") + "\n";
}

function renderPlatformsReference() {
  const rows = Object.entries(PLATFORM_CAPABILITIES).map(([platform, capability]) => (
    `| ${platform} | ${capability.commands} | ${capability.ask} | ${capability.plan} | ${capability.events} |`
  ));
  return [
    "# Platforms Reference",
    "",
    "| Platform | Commands | Ask | Plan | Events |",
    "|---|---|---|---|---|",
    ...rows,
  ].join("\n") + "\n";
}

function renderGeneratedArtifactsReference() {
  return [
    "# Generated Artifacts Reference",
    "",
    "| Artifact | Source | Repair |",
    "|---|---|---|",
    "| `.opencode/commands/hw-*.md` | command registry | `/hw:sync` |",
    "| `.opencode/agents/hw-*.md` | OpenCode artifact helper | `/hw:sync` |",
    "| `.cursor/rules/hypo-workflow.mdc` | third-party adapter helper | `/hw:sync --platform cursor` |",
    "| `.github/copilot-instructions.md` | third-party adapter helper | `/hw:sync --platform copilot` |",
    "| `.trae/rules/project_rules.md` | third-party adapter helper | `/hw:sync --platform trae` |",
    "| `.pipeline/*.compact.*` | `.pipeline/` authority files | `/hw:sync --repair` |",
    "| `docs/reference/*.md` | docs map | `/hw:docs repair` |",
    "| README managed blocks | command/platform helpers | `/hw:docs repair` |",
  ].join("\n") + "\n";
}

function userCommandCount() {
  return CANONICAL_COMMANDS.length;
}

async function writeGenerated(projectRoot, relativePath, content) {
  const path = join(projectRoot, relativePath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}

async function readOptionalText(file) {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}
