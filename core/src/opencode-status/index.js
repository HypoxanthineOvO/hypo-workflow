import { readFile } from "node:fs/promises";
import { join } from "node:path";

const NA = "n/a";
const OPENCODE_METADATA_PATH = ".opencode/hypo-workflow.json";
const OPENCODE_MODEL_AGENTS = Object.freeze([
  { name: "hw-plan", role: "plan", mode: "primary" },
  { name: "hw-build", role: "code-a", mode: "primary" },
  { name: "hw-compact", role: "compact", mode: "primary" },
  { name: "hw-test", role: "test", mode: "subagent" },
  { name: "hw-code-a", role: "code-a", mode: "subagent" },
  { name: "hw-code-b", role: "code-b", mode: "subagent" },
  { name: "hw-report", role: "report", mode: "primary" },
  { name: "hw-review", role: "debug", mode: "subagent" },
  { name: "hw-debug", role: "debug", mode: "subagent" },
]);

export async function buildOpenCodeStatusModel(projectRoot = ".", options = {}) {
  const pipelineDir = options.pipelineDir || ".pipeline";
  const root = join(projectRoot, pipelineDir);
  const sources = [];
  const warnings = [];

  const state = await readYaml(join(root, "state.yaml"), { required: true, sources, warnings });
  const cycle = await readYaml(join(root, "cycle.yaml"), { sources, warnings });
  const queue = await readYaml(join(root, "feature-queue.yaml"), { sources, warnings });
  const metrics = await readYaml(join(root, "metrics.yaml"), { sources, warnings });
  const log = await readYaml(join(root, "log.yaml"), { sources, warnings });
  const reportsCompact = await readText(join(root, "reports.compact.md"), { sources, warnings });
  const metadata = await readJson(join(projectRoot, OPENCODE_METADATA_PATH), { sources, warnings });
  const models = modelsFromOpenCode(metadata.value, options.opencode || {});

  if (!state.value) {
    return emptyModel({ sources, warnings, models });
  }

  const progress = progressFromState(state.value);
  const current = currentFromState(state.value);
  const latestScore = latestScoreFromState(state.value) || latestScoreFromReport(reportsCompact.value);
  const feature = currentFeature({ state: state.value, queue: queue.value, current });
  const gate = gateFromQueue(queue.value, feature, state.value);
  const metricSummary = metricsSummary(metrics.value, feature, state.value);
  const recentEvents = recentEventsFromLog(log.value);
  const cycleModel = cycleFromSources(cycle.value, queue.value, state.value);
  const pipeline = {
    name: state.value.pipeline?.name || "",
    status: state.value.pipeline?.status || "unknown",
    heartbeat: state.value.last_heartbeat || null,
  };

  const model = {
    ok: true,
    sources,
    warnings,
    cycle: cycleModel,
    pipeline,
    progress,
    current,
    feature,
    queue: {
      current_feature: queue.value?.current_feature ?? null,
      auto_chain: queue.value?.defaults?.auto_chain ?? null,
      failure_policy: queue.value?.defaults?.failure_policy ?? null,
      features: summarizeFeatures(queue.value?.features || []),
    },
    gate,
    metrics: metricSummary,
    models,
    latest_score: latestScore || fallbackScore(state.value),
    recent_events: recentEvents,
  };

  return {
    ...model,
    sidebar: renderSidebarModel(model),
    footer: renderFooterModel(model),
  };
}

function emptyModel({ sources, warnings, models }) {
  const model = {
    ok: false,
    sources,
    warnings,
    cycle: { id: null, name: null, status: "missing" },
    pipeline: { name: "", status: "missing_pipeline", heartbeat: null },
    progress: { completed: 0, total: 0, percent: 0 },
    current: { milestone_id: null, prompt_name: null, step: null, feature_id: null },
    feature: { id: null, title: null, status: "missing", gate: null, milestones: [] },
    queue: { current_feature: null, auto_chain: null, failure_policy: null, features: [] },
    gate: { status: "none", feature_id: null },
    metrics: { duration_ms: NA, token_count: NA, cost: NA },
    models,
    latest_score: { diff_score: null, overall: null, code_quality: null },
    recent_events: [],
  };
  return {
    ...model,
    sidebar: renderSidebarModel(model),
    footer: renderFooterModel(model),
  };
}

async function readJson(path, context) {
  const text = await readText(path, context);
  if (!text.value) return { value: null };
  try {
    return { value: JSON.parse(text.value) };
  } catch (error) {
    recordSource(context.sources, path, "error", error.message);
    context.warnings.push(`${path} parse error: ${error.message}`);
    return { value: null };
  }
}

async function readYaml(path, context) {
  const text = await readText(path, context);
  if (!text.value) return { value: null };
  try {
    return { value: parseStatusYaml(text.value) };
  } catch (error) {
    recordSource(context.sources, path, "error", error.message);
    context.warnings.push(`${relativePipelinePath(path)} parse error: ${error.message}`);
    return { value: null };
  }
}

async function readText(path, { required = false, sources, warnings }) {
  try {
    const value = await readFile(path, "utf8");
    recordSource(sources, path, "ok");
    return { value };
  } catch (error) {
    const status = required ? "missing_required" : "missing_optional";
    recordSource(sources, path, status, error.code || error.message);
    if (required) warnings.push(`${relativePipelinePath(path)} missing`);
    return { value: null };
  }
}

function recordSource(sources, path, status, message) {
  const existing = sources.find((source) => source.path === path);
  if (existing) {
    existing.status = status;
    if (message) existing.message = message;
    return;
  }
  sources.push({ path, status, ...(message ? { message } : {}) });
}

function progressFromState(state) {
  const completed = numberOrZero(state.pipeline?.prompts_completed);
  const total = numberOrZero(state.pipeline?.prompts_total);
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

function currentFromState(state) {
  const promptName = state.current?.prompt_name || "";
  const milestoneId = extractMilestoneId(promptName) || extractMilestoneId(state.current?.prompt_file);
  const milestone = asArray(state.milestones).find((item) => item.id === milestoneId) || {};
  return {
    milestone_id: milestoneId,
    prompt_name: state.current?.prompt_name || null,
    step: state.current?.step || null,
    feature_id: milestone.feature_id || extractFeatureId(promptName),
  };
}

function currentFeature({ state, queue, current }) {
  const features = asArray(queue?.features);
  const queueFeature = features.find((feature) => feature.id === queue?.current_feature)
    || features.find((feature) => feature.id === current.feature_id)
    || features.find((feature) => feature.gate === "confirm" && feature.status === "queued")
    || null;
  if (queueFeature) {
    return {
      id: queueFeature.id || null,
      title: queueFeature.title || null,
      status: queueFeature.status || "unknown",
      gate: queueFeature.gate || null,
      decompose_mode: queueFeature.decompose_mode || null,
      milestones: asArray(queueFeature.milestones),
    };
  }
  return {
    id: current.feature_id || null,
    title: null,
    status: state.pipeline?.status || "unknown",
    gate: null,
    decompose_mode: null,
    milestones: [],
  };
}

function gateFromQueue(queue, feature, state) {
  if (queue?.current_feature === null) {
    const waiting = (queue.features || []).find((item) => item.gate === "confirm" && item.status === "queued");
    if (waiting) {
      return {
        status: "waiting_confirmation",
        feature_id: waiting.id,
        gate: "confirm",
      };
    }
  }
  if (feature?.gate === "confirm" && state.pipeline?.status === "stopped") {
    return {
      status: "waiting_confirmation",
      feature_id: feature.id,
      gate: "confirm",
    };
  }
  return {
    status: "none",
    feature_id: feature?.id || null,
    gate: feature?.gate || null,
  };
}

function metricsSummary(metrics, feature, state) {
  const cycleRecord = asArray(metrics?.cycles).find((item) => item.id === metrics?.cycle_id);
  const featureRecord = asArray(metrics?.features).find((item) => item.id === feature?.id);
  const milestoneId = currentFromState(state).milestone_id;
  const milestoneRecord = asArray(metrics?.milestones).find((item) => item.id === milestoneId);
  const record = milestoneRecord || featureRecord || cycleRecord || {};
  return {
    duration_ms: fallbackMetric(record.duration_ms),
    token_count: fallbackMetric(record.token_count),
    cost: fallbackMetric(record.cost),
  };
}

function latestScoreFromState(state) {
  const entries = state.history?.completed_prompts || [];
  const latest = [...entries].reverse().find((entry) => entry.evaluation);
  return latest?.evaluation || null;
}

function latestScoreFromReport(source) {
  if (!source) return null;
  const diff = /diff_score\s*=?\s*(\d+)/i.exec(source)?.[1];
  const overall = /overall\s*=?\s*(\d+)/i.exec(source)?.[1];
  if (!diff && !overall) return null;
  return {
    diff_score: diff ? Number(diff) : null,
    overall: overall ? Number(overall) : null,
    code_quality: null,
  };
}

function fallbackScore(state) {
  return {
    diff_score: state.prompt_state?.diff_score ?? null,
    overall: state.prompt_state?.evaluation?.overall ?? null,
    code_quality: state.prompt_state?.code_quality ?? null,
  };
}

function recentEventsFromLog(log) {
  const entries = asArray(log?.entries);
  return entries.slice(-10).reverse().map((entry) => ({
    id: entry.id || null,
    type: entry.type || null,
    status: entry.status || null,
    timestamp: entry.timestamp || null,
    summary: entry.summary || "",
  }));
}

function cycleFromSources(cycle, queue, state) {
  const number = cycle?.cycle?.number || queue?.cycle_id || null;
  return {
    id: typeof number === "number" ? `C${number}` : number,
    name: cycle?.cycle?.name || state.pipeline?.name || null,
    status: cycle?.cycle?.status || state.pipeline?.status || "unknown",
  };
}

function renderSidebarModel(model) {
  const current = model.current.milestone_id || "no milestone";
  const progress = `${model.progress.completed}/${model.progress.total}`;
  return {
    title: "Hypo-Workflow",
    summary: `${model.cycle.id || "C?"} ${current} ${model.current.step || model.pipeline.status} ${progress}`,
    sections: [
      {
        title: "Current",
        items: [
          `Cycle: ${model.cycle.id || NA}`,
          `Feature: ${formatFeatureLabel(model.feature)}`,
          `Milestone: ${current}`,
          `Step: ${model.current.step || NA}`,
          `Gate: ${model.gate.status === "none" ? model.feature.gate || NA : model.gate.status}`,
        ],
      },
      {
        title: "Models",
        items: [
          `Current: ${formatAgentModel(model.models.current)}`,
          `Active subagent: ${formatAgentModel(model.models.active_subagent)}`,
          ...model.models.subagents.slice(0, 5).map(formatAgentModel),
        ],
      },
      {
        title: "Feature Queue",
        items: [
          `Current: ${model.queue.current_feature || NA}`,
          `Auto-chain: ${formatBoolean(model.queue.auto_chain)}`,
          `Failure policy: ${model.queue.failure_policy || NA}`,
          ...model.queue.features.slice(0, 6).map(formatQueueFeature),
        ],
      },
      {
        title: "Milestones",
        items: model.feature.milestones.length
          ? model.feature.milestones.map(formatMilestone)
          : [NA],
      },
      {
        title: "Blocked / Deferred",
        items: blockedOrDeferred(model.queue.features),
      },
      {
        title: "Metrics",
        items: [
          `Duration: ${model.metrics.duration_ms}`,
          `Tokens: ${model.metrics.token_count}`,
          `Cost: ${model.metrics.cost}`,
        ],
      },
      {
        title: "Recent",
        items: model.recent_events.slice(0, 10).map((event) => event.summary),
      },
    ],
  };
}

function renderFooterModel(model) {
  const score = model.latest_score?.diff_score ?? NA;
  const parts = [
    `HW ${model.pipeline.status}`,
    model.cycle.id || "C?",
    `${model.progress.completed}/${model.progress.total}`,
    model.current.milestone_id || "M?",
    model.current.step || model.gate.status,
    `model:${shortModel(model.models.current.model)}`,
    `sub:${shortModel(model.models.active_subagent.model)}`,
    `score:${score}`,
    `tokens:${model.metrics.token_count}`,
    `cost:${model.metrics.cost}`,
  ];
  if (model.gate.status === "waiting_confirmation") parts.push("confirm");
  return { text: parts.join(" | ") };
}

function extractMilestoneId(value = "") {
  return /\b(M\d+)\b/.exec(String(value))?.[1] || null;
}

function extractFeatureId(value = "") {
  return /\b(F\d+)\b/.exec(String(value))?.[1] || null;
}

function numberOrZero(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function fallbackMetric(value) {
  return value === undefined || value === null ? NA : value;
}

function summarizeFeatures(features) {
  return asArray(features).map((feature) => ({
    id: feature.id || null,
    title: feature.title || null,
    status: feature.status || "unknown",
    gate: feature.gate || null,
    decompose_mode: feature.decompose_mode || null,
    milestones: asArray(feature.milestones),
  }));
}

function formatFeatureLabel(feature) {
  const parts = [feature.id || NA];
  if (feature.title) parts.push(feature.title);
  if (feature.status) parts.push(`(${feature.status})`);
  return parts.join(" ");
}

function formatQueueFeature(feature) {
  const pieces = [
    feature.id || NA,
    feature.status || "unknown",
    feature.gate ? `gate:${feature.gate}` : null,
    feature.decompose_mode ? `mode:${feature.decompose_mode}` : null,
    feature.title || null,
  ].filter(Boolean);
  return pieces.join(" | ");
}

function formatMilestone(milestone) {
  return [milestone.id || NA, milestone.status || "unknown", milestone.prompt_file || null]
    .filter(Boolean)
    .join(" | ");
}

function blockedOrDeferred(features) {
  const items = features
    .filter((feature) => feature.status === "blocked" || feature.status === "deferred")
    .map((feature) => `${feature.id || NA} | ${feature.status} | ${feature.title || ""}`.trim());
  return items.length ? items : ["none"];
}

function modelsFromOpenCode(metadata, runtime) {
  const configured = configuredAgentModels(metadata);
  const current = normalizeRuntimeAgentModel(runtime.current)
    || configured.find((agent) => agent.name === metadata?.default_agent)
    || { agent: runtime.current?.agent || metadata?.default_agent || NA, model: runtime.current?.model || metadata?.model || NA };
  const activeSubagent = normalizeRuntimeAgentModel(runtime.active_subagent || runtime.subagent)
    || { agent: NA, model: NA };

  return {
    current,
    active_subagent: activeSubagent,
    configured,
    subagents: configured.filter((agent) => agent.mode === "subagent"),
  };
}

function configuredAgentModels(metadata) {
  const agents = metadata?.agents || {};
  return OPENCODE_MODEL_AGENTS.map((agent) => {
    const rawModel = agents[agent.role]?.model;
    return {
      agent: agent.name,
      role: agent.role,
      mode: agent.mode,
      model: rawModel ? qualifyModelId(rawModel, metadata) : NA,
    };
  });
}

function normalizeRuntimeAgentModel(value) {
  if (!value || typeof value !== "object") return null;
  const model = normalizeModelId(value.model) || normalizeModelId(value.modelID)
    || normalizeProviderModel(value.providerID, value.modelID);
  if (!model && !value.agent) return null;
  return {
    agent: value.agent || NA,
    model: model || NA,
  };
}

function normalizeModelId(model) {
  if (!model) return null;
  if (typeof model === "string") return model;
  return normalizeProviderModel(model.providerID, model.modelID);
}

function normalizeProviderModel(providerID, modelID) {
  if (!providerID || !modelID) return null;
  return `${providerID}/${modelID}`;
}

function qualifyModelId(model, metadata) {
  if (!model || model.includes("/")) return model || NA;
  for (const [providerId, provider] of Object.entries(metadata?.providers || {})) {
    if (provider?.models && Object.prototype.hasOwnProperty.call(provider.models, model)) {
      return `${providerId}/${model}`;
    }
  }
  if (model.startsWith("gpt-")) return `openai/${model}`;
  if (model.startsWith("claude-")) return `anthropic/${model}`;
  if (model.startsWith("mimo-")) return `mimo/${model}`;
  if (model.startsWith("deepseek-")) return `deepseek/${model}`;
  return model;
}

function formatAgentModel(value) {
  if (!value) return NA;
  const prefix = value.agent || value.role || NA;
  return `${prefix} -> ${value.model || NA}`;
}

function shortModel(value) {
  if (!value || value === NA) return NA;
  return String(value).split("/").pop();
}

function formatBoolean(value) {
  if (value === true) return "true";
  if (value === false) return "false";
  return NA;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  return Object.values(value).filter((item) => item && typeof item === "object");
}

function relativePipelinePath(path) {
  const index = path.indexOf(".pipeline/");
  return index === -1 ? path : path.slice(index);
}

function parseStatusYaml(source) {
  const lines = source
    .split(/\r?\n/)
    .map((raw) => ({ raw, indent: raw.match(/^ */)[0].length, text: raw.trim() }))
    .filter((line) => line.text && !line.text.startsWith("#"));
  let index = 0;

  function parseNode(indent) {
    if (index >= lines.length) return {};
    return lines[index].text.startsWith("- ") && lines[index].indent === indent
      ? parseArray(indent)
      : parseObject(indent);
  }

  function parseArray(indent) {
    const value = [];
    while (index < lines.length) {
      const line = lines[index];
      if (line.indent < indent) break;
      if (line.indent !== indent || !line.text.startsWith("- ")) break;

      const rest = line.text.slice(2).trim();
      index += 1;
      if (!rest) {
        value.push(index < lines.length && lines[index].indent > indent ? parseNode(lines[index].indent) : null);
        continue;
      }

      const pair = parseKeyValue(rest);
      if (pair) {
        const item = {};
        setParsedValue(item, pair, indent);
        if (index < lines.length && lines[index].indent > indent) {
          Object.assign(item, parseObject(lines[index].indent));
        }
        value.push(item);
      } else {
        value.push(parseScalar(rest));
      }
    }
    return value;
  }

  function parseObject(indent) {
    const value = {};
    while (index < lines.length) {
      const line = lines[index];
      if (line.indent < indent) break;
      if (line.indent !== indent) break;
      if (line.text.startsWith("- ")) break;

      const pair = parseKeyValue(line.text);
      if (!pair) {
        index += 1;
        continue;
      }
      index += 1;
      setParsedValue(value, pair, indent);
    }
    return value;
  }

  function setParsedValue(object, pair, indent) {
    if (!pair.rawValue) {
      object[pair.key] = index < lines.length && lines[index].indent > indent ? parseNode(lines[index].indent) : {};
    } else {
      object[pair.key] = parseScalar(pair.rawValue);
    }
  }

  return lines.length ? parseNode(lines[0].indent) : {};
}

function parseKeyValue(text) {
  const match = /^([^:]+):(.*)$/.exec(text);
  if (!match) return null;
  return {
    key: match[1].trim(),
    rawValue: match[2].trim(),
  };
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("[") && !trimmed.endsWith("]")) {
    throw new Error(`Malformed inline array: ${trimmed}`);
  }
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    return inner ? inner.split(",").map((item) => parseScalar(item.trim())) : [];
  }
  if (
    (trimmed.startsWith('"') && !trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && !trimmed.endsWith("'"))
  ) {
    throw new Error(`Malformed quoted scalar: ${trimmed}`);
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
