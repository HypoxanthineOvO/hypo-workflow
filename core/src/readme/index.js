import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { CANONICAL_COMMANDS } from "../commands/index.js";
import { PLATFORM_CAPABILITIES } from "../platform/index.js";

const DEFAULT_README_CONFIG = Object.freeze({
  mode: "loose",
  full_regen: "auto",
});

const USER_COMMANDS = CANONICAL_COMMANDS.filter((command) => command.canonical !== "/hw:watchdog");

export function defaultReadmeConfig() {
  return { ...DEFAULT_README_CONFIG };
}

export function renderReadmeBlock(block, context = {}) {
  switch (block) {
    case "badges":
      return renderBadges(context);
    case "feature-summary":
      return renderFeatureSummary();
    case "command-count":
      return renderCommandCount();
    case "command-reference":
      return renderCommandReference();
    case "platform-matrix":
      return renderPlatformMatrix();
    case "release-summary":
      return renderReleaseSummary();
    case "version-history":
      return renderVersionHistory(context);
    default:
      throw new Error(`Unknown README block: ${block}`);
  }
}

export function replaceManagedBlock(source, block, replacement, options = {}) {
  const policy = { ...DEFAULT_README_CONFIG, ...(options || {}) };
  const begin = `<!-- HW:README:BEGIN ${block} -->`;
  const end = `<!-- HW:README:END ${block} -->`;
  const pattern = new RegExp(`${escapeRegExp(begin)}[\\s\\S]*?${escapeRegExp(end)}`);

  if (!pattern.test(source)) {
    if (policy.mode === "strict") {
      throw new Error(`missing managed README block: ${block}`);
    }
    return source;
  }

  return source.replace(pattern, `${begin}\n${replacement.trim()}\n${end}`);
}

export async function updateReadme(readmeFile = "README.md", options = {}) {
  const policy = { ...DEFAULT_README_CONFIG, ...(options.policy || {}) };
  const blocks = options.blocks || [
    "badges",
    "feature-summary",
    "command-count",
    "command-reference",
    "platform-matrix",
    "release-summary",
    "version-history",
  ];
  const original = await readFile(readmeFile, "utf8");
  let next = original;
  const changedBlocks = [];
  const warnings = [];

  for (const block of blocks) {
    const rendered = renderReadmeBlock(block, options.context || {});
    const before = next;
    try {
      next = replaceManagedBlock(next, block, rendered, policy);
    } catch (error) {
      warnings.push({ block, message: error.message });
      throw error;
    }
    if (next !== before) changedBlocks.push(block);
  }

  if (options.write && next !== original) {
    await writeFile(readmeFile, next.endsWith("\n") ? next : `${next}\n`, "utf8");
  }

  return {
    changed: next !== original,
    changedBlocks,
    fullRegenerated: false,
    warnings,
    content: next,
  };
}

export async function checkReadmeFreshness(readmeFile = "README.md", options = {}) {
  const projectRoot = options.projectRoot || ".";
  const readme = await readFile(readmeFile, "utf8");
  const version = await readVersion(projectRoot);
  const commandCount = await readCommandCount(projectRoot);
  const failures = [];

  if (version && !readme.includes(`version-${version}`) && !readme.includes(`v${version}`)) {
    failures.push({
      check: "version",
      expected: version,
      message: `README version does not match ${version}`,
    });
  }

  const commandPatterns = [
    `${commandCount} 个用户指令`,
    `${commandCount} user`,
    `${commandCount} commands`,
  ];
  if (!commandPatterns.some((pattern) => readme.includes(pattern))) {
    failures.push({
      check: "command-count",
      expected: commandCount,
      message: `README command count does not match ${commandCount}`,
    });
  }

  for (const platform of ["Codex", "Claude Code", "OpenCode"]) {
    if (!readme.includes(platform)) {
      failures.push({
        check: "platform-matrix",
        expected: platform,
        message: `README platform matrix is missing ${platform}`,
      });
    }
  }

  for (const releaseTerm of ["regression", "version", "changelog", "commit", "tag", "push"]) {
    if (!new RegExp(releaseTerm, "i").test(readme)) {
      failures.push({
        check: "release-summary",
        expected: releaseTerm,
        message: `README release summary is missing ${releaseTerm}`,
      });
    }
  }

  return {
    fresh: failures.length === 0,
    failures,
  };
}

function renderBadges(context) {
  const version = context.version || "9.1.0";
  return [
    `[![Version](https://img.shields.io/badge/version-${version}-blue)](.claude-plugin/plugin.json)`,
    "[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)",
    "[![Platform](https://img.shields.io/badge/platform-Claude%20Code%20%7C%20Codex%20%7C%20OpenCode-purple)](#平台支持)",
  ].join("\n");
}

function renderFeatureSummary() {
  return [
    "| 能力 | 说明 |",
    "|---|---|",
    "| Pipeline 执行 | 按 preset 串行执行 prompts，并持久化状态、日志和报告 |",
    "| Plan Mode | Discover -> Decompose -> Generate -> Confirm 的交互式规划闭环 |",
    "| Lifecycle | init、check、audit、debug、release、cycle、patch、compact、showcase |",
    "| Rules | 使用内置和自定义规则固化 Agent 行为约束 |",
    "| 多平台 | Codex、Claude Code、OpenCode 共享 `.pipeline/` 文件协议 |",
  ].join("\n");
}

function renderCommandCount() {
  return `当前版本提供 **${USER_COMMANDS.length} 个用户指令**，另有 **1 个内部 watchdog** skill。`;
}

function renderCommandReference() {
  const rows = USER_COMMANDS.map((command) => (
    `| \`${command.canonical}\` | \`${command.opencode}\` | \`${command.agent}\` | \`${command.skill}\` |`
  ));
  return ["| Canonical | OpenCode | Agent | Skill |", "|---|---|---|---|", ...rows].join("\n");
}

function renderPlatformMatrix() {
  const rows = Object.entries(PLATFORM_CAPABILITIES).map(([platform, capability]) => (
    `| ${displayPlatform(platform)} | ${capability.commands} | ${capability.ask} | ${capability.plan} | ${capability.events} |`
  ));
  return ["| Platform | Commands | Ask | Plan | Events |", "|---|---|---|---|---|", ...rows].join("\n");
}

function renderReleaseSummary() {
  return [
    "Release flow: preflight -> regression -> version update -> update_readme -> readme-freshness -> changelog -> commit/tag/push gates.",
    "",
    "- `update_readme` runs after versioned files are updated and before the release commit.",
    "- `readme-freshness` checks version, command count, platform matrix, feature summary, and release summary.",
    "- tag and push remain gated by explicit confirmation.",
  ].join("\n");
}

function renderVersionHistory(context) {
  const version = context.version || "9.1.0";
  return `Current release: v${version}. See CHANGELOG and README changelog section for recent milestone history.`;
}

async function readVersion(projectRoot) {
  try {
    const raw = await readFile(join(projectRoot, ".claude-plugin", "plugin.json"), "utf8");
    return JSON.parse(raw).version;
  } catch {
    return null;
  }
}

async function readCommandCount(projectRoot) {
  try {
    const raw = await readFile(join(projectRoot, "core", "src", "commands", "index.js"), "utf8");
    return (raw.match(/canonical:/g) || []).length;
  } catch {
    return USER_COMMANDS.length;
  }
}

function displayPlatform(platform) {
  if (platform === "claude-code") return "Claude Code";
  if (platform === "opencode") return "OpenCode";
  return "Codex";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
