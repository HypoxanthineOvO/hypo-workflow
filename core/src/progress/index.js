import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { redactSecrets } from "../evidence/index.js";

const BOARD_HEADERS = Object.freeze({
  milestone: "| # | Milestone | 状态 | 摘要 |",
  timeline: "| 时间 | 类型 | 事件 | 结果 |",
  patch: "| Patch | 状态 | 时间 | 摘要 |",
});

export function appendProgressEvent(source = "", event = {}) {
  const normalized = normalizeProgressEvent(event);
  const metadata = updateMetadata(source, normalized);
  const sections = splitProgressSections(source);
  const timeline = upsertTimelineRow(sections.timeline, normalized);
  const milestone = maybeUpdateMilestoneRow(sections.milestone, normalized);
  const patch = maybeUpdatePatchRow(sections.patch, normalized);
  const body = [
    metadata,
    sections.currentState,
    sections.milestoneTitle,
    milestone,
    timeline,
    patch,
    sections.deferred,
  ].filter(Boolean).join("\n\n");

  return ensureTrailingNewline(body);
}

export function renderProgressFromSnapshot(snapshot = {}) {
  const language = snapshot.language || "zh-CN";
  const timezone = snapshot.timezone || "Asia/Shanghai";
  const pipeline = snapshot.pipeline || {};
  const current = snapshot.current || {};
  const milestones = Array.isArray(snapshot.milestones) ? snapshot.milestones : [];
  const timeline = Array.isArray(snapshot.timeline) ? snapshot.timeline : [];
  const patches = Array.isArray(snapshot.patches) ? snapshot.patches : [];
  const deferred = Array.isArray(snapshot.deferred) ? snapshot.deferred : [];
  const title = snapshot.title || "Hypo-Workflow";
  const lastUpdate = snapshot.last_update || snapshot.updated_at || null;
  const status = snapshot.status || pipeline.status || "idle";
  const completed = snapshot.completed ?? pipeline.prompts_completed ?? 0;
  const total = snapshot.total ?? pipeline.prompts_total ?? 0;

  const lines = [
    `# ${title} - ${language === "zh-CN" ? "开发进度" : "Progress"}`,
    "",
    `> ${language === "zh-CN" ? "最后更新" : "Last updated"}：${formatProgressTime(lastUpdate, timezone, language)} | ${language === "zh-CN" ? "状态" : "Status"}：${status} | ${language === "zh-CN" ? "进度" : "Progress"}：${completed}/${total} Milestone`,
    "",
    `## ${language === "zh-CN" ? "当前状态" : "Current"}`,
    renderCurrentState(current, language),
    "",
    `## ${language === "zh-CN" ? "Milestone 进度" : "Milestones"}`,
    ...renderMilestoneTable(milestones, language),
    "",
    `## ${language === "zh-CN" ? "时间线" : "Timeline"}`,
    ...renderTimelineTable(timeline, language),
  ];

  if (patches.length) {
    lines.push("", `## ${language === "zh-CN" ? "Patch 轨道" : "Patches"}`, ...renderPatchTable(patches, language));
  }

  if (deferred.length) {
    lines.push("", `## ${language === "zh-CN" ? "Deferred 项" : "Deferred"}`, ...renderDeferredList(deferred, language));
  }

  return ensureTrailingNewline(lines.join("\n"));
}

export async function readProgressSnapshot(projectRoot = ".", options = {}) {
  const pipelineDir = options.pipelineDir || ".pipeline";
  const root = join(projectRoot, pipelineDir);
  const progress = await readOptionalText(join(root, "PROGRESS.md"));
  return progress ? progress : "";
}

export function parseProgressTables(source = "", options = {}) {
  const limit = Number(options.limit || 10);
  const metadataLine = source.split(/\r?\n/).find((line) => line.trim().startsWith("> ")) || "";
  const milestoneTable = parseMarkdownTable(extractSection(source, "Milestone 进度"));
  const timelineTable = parseMarkdownTable(extractSection(source, "时间线"));
  const settingsTable = parseMarkdownTable(extractSection(source, "基本设置"));
  const current = stripMarkdown(extractSectionBody(source, "当前状态")).trim();

  return {
    metadata: parseProgressMetadata(metadataLine),
    current: {
      summary: redactProgressText(current),
    },
    settings: settingsTable.map((row) => ({
      key: redactProgressText(row["项目"] || row.Item || row.key || ""),
      value: redactProgressText(row["值"] || row.Value || row.value || ""),
    })).filter((row) => row.key || row.value),
    milestones: milestoneTable.map((row) => ({
      id: redactProgressText(row["#"] || row.id || ""),
      feature: redactProgressText(row.Feature || row.feature || ""),
      milestone: redactProgressText(row.Milestone || row.milestone || ""),
      status: redactProgressText(row["状态"] || row.Status || row.status || ""),
      summary: redactProgressText(row["摘要"] || row.Summary || row.summary || ""),
    })).filter((row) => row.id || row.milestone),
    recent_events: timelineTable.slice(0, limit).map((row) => ({
      time: redactProgressText(row["时间"] || row.Time || row.time || ""),
      type: redactProgressText(row["类型"] || row.Type || row.type || ""),
      event: redactProgressText(row["事件"] || row.Event || row.event || ""),
      result: redactProgressText(row["结果"] || row.Result || row.result || ""),
    })).filter((row) => row.time || row.event || row.result),
  };
}

function normalizeProgressEvent(event = {}) {
  return {
    timestamp: event.timestamp || new Date().toISOString(),
    section: event.section || "timeline",
    type: event.type || "Step",
    name: event.name || event.event || "update",
    result: event.result || "",
    milestone: event.milestone || null,
    patch: event.patch || null,
    status: event.status || null,
    language: event.language || "zh-CN",
    timezone: event.timezone || "Asia/Shanghai",
    summary: event.summary || "",
  };
}

function updateMetadata(source, event) {
  const existing = source || "";
  const timestamp = formatProgressTime(event.timestamp, event.timezone, event.language, true);
  if (/^> /.test(existing)) {
    return existing.replace(/^> .*/m, `> ${event.language === "zh-CN" ? "最后更新" : "Last updated"}：${timestamp} | ${event.language === "zh-CN" ? "状态" : "Status"}：${event.status || "running"} | ${event.language === "zh-CN" ? "进度" : "Progress"}：${event.summary || "0/0"} Milestone`);
  }
  return `> ${event.language === "zh-CN" ? "最后更新" : "Last updated"}：${timestamp} | ${event.language === "zh-CN" ? "状态" : "Status"}：${event.status || "running"} | ${event.language === "zh-CN" ? "进度" : "Progress"}：${event.summary || "0/0"} Milestone`;
}

function splitProgressSections(source) {
  const milestone = extractTableSection(source, "Milestone 进度");
  const timeline = extractTableSection(source, "时间线");
  const patch = extractTableSection(source, "Patch 轨道");
  const currentState = extractSection(source, "当前状态");
  const milestoneTitle = hasSection(source, "Milestone 进度") ? `## Milestone 进度` : "";
  const deferred = extractSection(source, "Deferred 项");
  return { milestone, timeline, patch, currentState, milestoneTitle, deferred };
}

function upsertTimelineRow(section, event) {
  const row = `| ${formatProgressTime(event.timestamp, event.timezone, event.language)} | ${event.type} | ${event.name} | ${event.result || "—"} |`;
  if (!section) {
    return `## ${event.language === "zh-CN" ? "时间线" : "Timeline"}\n\n${BOARD_HEADERS.timeline}\n|---|---|---|---|\n${row}`;
  }
  const lines = section.split("\n");
  const headerIndex = lines.findIndex((line) => line.trim() === BOARD_HEADERS.timeline);
  if (headerIndex === -1) return section;
  const separatorIndex = lines.findIndex((line, index) => index > headerIndex && line.trim() === "|---|---|---|---|");
  const insertAt = separatorIndex === -1 ? headerIndex + 1 : separatorIndex + 1;
  lines.splice(insertAt, 0, row);
  return lines.join("\n");
}

function maybeUpdateMilestoneRow(section, event) {
  if (!section || !event.milestone) return section;
  return section;
}

function maybeUpdatePatchRow(section, event) {
  if (!section || !event.patch) return section;
  return section;
}

function renderCurrentState(current = {}, language = "zh-CN") {
  const phase = current.phase || "idle";
  const step = current.step || "n/a";
  const prompt = current.prompt_name || "n/a";
  return language === "zh-CN"
    ? `🔄 **${prompt}** — ${phase}（step: ${step}）`
    : `🔄 **${prompt}** — ${phase} (step: ${step})`;
}

function renderMilestoneTable(rows = [], language = "zh-CN") {
  const lines = [BOARD_HEADERS.milestone, "|---|---|---|---|"];
  for (const row of rows) {
    lines.push(`| ${row.id || "M?"} | ${row.title || row.name || "—"} | ${row.status || "—"} | ${row.summary || "—"} |`);
  }
  if (!rows.length) lines.push(`| — | — | ${language === "zh-CN" ? "待规划" : "Pending"} | — |`);
  return lines;
}

function renderTimelineTable(rows = [], language = "zh-CN") {
  const lines = [BOARD_HEADERS.timeline, "|---|---|---|---|"];
  if (!rows.length) lines.push(`| — | — | ${language === "zh-CN" ? "待开始" : "Pending"} | — |`);
  for (const row of rows) {
    lines.push(`| ${row.time || "—"} | ${row.type || "—"} | ${row.event || "—"} | ${row.result || "—"} |`);
  }
  return lines;
}

function renderPatchTable(rows = [], language = "zh-CN") {
  const lines = [BOARD_HEADERS.patch, "|---|---|---|---|"];
  if (!rows.length) lines.push(`| — | — | — | ${language === "zh-CN" ? "无" : "none"} |`);
  for (const row of rows) {
    lines.push(`| ${row.id || "P?"} | ${row.status || "—"} | ${row.time || "—"} | ${row.summary || "—"} |`);
  }
  return lines;
}

function renderDeferredList(rows = [], language = "zh-CN") {
  if (!rows.length) return [`- ${language === "zh-CN" ? "无" : "none"}`];
  return rows.map((row) => `- ${row}`);
}

function extractSection(source, heading) {
  if (!source) return "";
  const lines = source.split(/\r?\n/);
  const index = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (index === -1) return "";
  const collected = [lines[index]];
  for (let i = index + 1; i < lines.length; i += 1) {
    if (/^## /.test(lines[i])) break;
    collected.push(lines[i]);
  }
  return collected.join("\n").trimEnd();
}

function extractSectionBody(source, heading) {
  const section = extractSection(source, heading);
  return section.split(/\r?\n/).slice(1).join("\n");
}

function parseMarkdownTable(section = "") {
  const rows = section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));
  if (rows.length < 2) return [];
  const header = splitMarkdownRow(rows[0]);
  const body = rows.slice(2);
  return body.map((line) => {
    const cells = splitMarkdownRow(line);
    const item = {};
    header.forEach((key, index) => {
      item[key] = stripMarkdown(cells[index] || "").trim();
    });
    return item;
  });
}

function splitMarkdownRow(line) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseProgressMetadata(line = "") {
  const text = line.replace(/^>\s*/, "");
  const metadata = {};
  for (const part of text.split("|")) {
    const [rawKey, ...rawValue] = part.split(/[：:]/);
    const key = normalizeMetadataKey(rawKey);
    if (!key) continue;
    metadata[key] = redactProgressText(rawValue.join(":").trim());
  }
  return metadata;
}

function normalizeMetadataKey(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.includes("最后更新") || normalized.includes("last updated")) return "last_updated";
  if (normalized.includes("状态") || normalized === "status") return "status";
  if (normalized.includes("进度") || normalized === "progress") return "progress";
  return "";
}

function stripMarkdown(value = "") {
  return String(value)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .trim();
}

function redactProgressText(value = "") {
  return redactSecrets(String(value), { replacement: "[redacted]" });
}

function extractTableSection(source, heading) {
  return extractSection(source, heading);
}

function hasSection(source, heading) {
  return extractSection(source, heading).length > 0;
}

async function readOptionalText(path) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

function formatProgressTime(value, timezone, language, raw = false) {
  if (!value) return raw ? "n/a" : "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return raw ? String(value) : String(value);
  const time = new Intl.DateTimeFormat(language === "zh-CN" ? "zh-CN" : "en", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  return time;
}

function ensureTrailingNewline(value) {
  return String(value || "").replace(/\s*$/, "\n");
}
