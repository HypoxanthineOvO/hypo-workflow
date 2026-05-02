import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_GLOBAL_CONFIG, mergeConfig, parseYaml, writeConfig } from "../config/index.js";

export function resolveAcceptancePolicy(projectConfig = {}, globalConfig = DEFAULT_GLOBAL_CONFIG) {
  const merged = mergeConfig(
    mergeConfig(DEFAULT_GLOBAL_CONFIG.acceptance, globalConfig?.acceptance || {}),
    projectConfig?.acceptance || {},
  );
  const mode = normalizeAcceptanceMode(merged.mode);
  return {
    mode,
    require_user_confirm: mode === "manual" || mode === "confirm" ? true : Boolean(merged.require_user_confirm),
    default_state: normalizeAcceptanceState(merged.default_state),
    timeout_hours: positiveNumber(merged.timeout_hours, DEFAULT_GLOBAL_CONFIG.acceptance.timeout_hours),
    reject_escalation_threshold: positiveInteger(
      merged.reject_escalation_threshold,
      DEFAULT_GLOBAL_CONFIG.acceptance.reject_escalation_threshold,
    ),
  };
}

export function evaluateAcceptanceStatus(acceptance = {}, policy = {}, options = {}) {
  const state = acceptance.state || policy.default_state || DEFAULT_GLOBAL_CONFIG.acceptance.default_state;
  const resolved = {
    ...acceptance,
    state,
    mode: acceptance.mode || policy.mode || DEFAULT_GLOBAL_CONFIG.acceptance.mode,
    timed_out: false,
    automatic: Boolean(acceptance.automatic),
  };
  if (state !== "pending" || policy.mode !== "timeout") return resolved;

  const requestedAt = Date.parse(acceptance.requested_at || acceptance.updated_at || "");
  const now = Date.parse(options.now || new Date().toISOString());
  const timeoutHours = positiveNumber(policy.timeout_hours, DEFAULT_GLOBAL_CONFIG.acceptance.timeout_hours);
  if (!Number.isFinite(requestedAt) || !Number.isFinite(now)) return resolved;
  if (now - requestedAt < timeoutHours * 60 * 60 * 1000) return resolved;

  return {
    ...resolved,
    state: "accepted",
    timed_out: true,
    automatic: true,
    reason: "timeout",
  };
}

export function createRejectionFeedbackTemplate(options = {}) {
  return {
    scope: options.scope || "cycle",
    ref: options.ref || null,
    iteration: positiveInteger(options.iteration, 1),
    problem: "",
    reproduce_steps: "",
    expected: "",
    actual: "",
    context: options.context || "",
    created_at: options.created_at || new Date().toISOString(),
  };
}

export async function markCyclePendingAcceptance(projectRoot = ".", options = {}) {
  const context = await loadAcceptanceContext(projectRoot);
  const now = options.now || new Date().toISOString();
  const cycleId = cycleIdentifier(context.cycle);
  const mode = options.mode || context.cycle.cycle?.acceptance?.mode || "manual";
  const cycle = {
    ...context.cycle,
    cycle: {
      ...context.cycle.cycle,
      status: "pending_acceptance",
      acceptance: {
        ...(context.cycle.cycle?.acceptance || {}),
        mode,
        state: "pending",
        requested_at: now,
      },
    },
  };
  const state = {
    ...context.state,
    pipeline: {
      ...(context.state.pipeline || {}),
      status: "pending_acceptance",
    },
    acceptance: compactAcceptanceState({
      scope: "cycle",
      state: "pending",
      mode,
      cycle_id: cycleId,
      updated_at: now,
    }),
  };

  await persistAcceptanceContext(context, { cycle, state });
  await appendLifecycleLog(context.logFile, {
    id: `CYCLE-PENDING-${cycleId}-${compactTimestamp(now)}`,
    type: "cycle_pending_acceptance",
    ref: cycleId,
    status: "pending_acceptance",
    timestamp: now,
    summary: `Cycle ${cycleId} is pending user acceptance.`,
    trigger: "auto",
  });
  await appendProgressRow(context.progressFile, now, "Cycle", `${cycleId} pending_acceptance`, "等待用户 acceptance");
  return { cycle, state, archived: false };
}

export async function acceptCycle(projectRoot = ".", options = {}) {
  const context = await loadAcceptanceContext(projectRoot);
  const now = options.now || new Date().toISOString();
  const cycleId = cycleIdentifier(context.cycle);
  const cycle = {
    ...context.cycle,
    cycle: {
      ...context.cycle.cycle,
      status: "completed",
      finished: now,
      acceptance: {
        ...(context.cycle.cycle?.acceptance || {}),
        state: "accepted",
        accepted_at: now,
      },
    },
  };
  const state = {
    ...context.state,
    pipeline: {
      ...(context.state.pipeline || {}),
      status: "completed",
      finished: now,
    },
    current: {
      ...(context.state.current || {}),
      phase: "completed",
    },
    acceptance: compactAcceptanceState({
      ...(context.state.acceptance || {}),
      scope: "cycle",
      state: "accepted",
      cycle_id: cycleId,
      updated_at: now,
    }),
  };

  await persistAcceptanceContext(context, { cycle, state });
  await appendLifecycleLog(context.logFile, {
    id: `CYCLE-ACCEPTED-${cycleId}-${compactTimestamp(now)}`,
    type: "cycle_accept",
    ref: cycleId,
    status: "completed",
    timestamp: now,
    summary: `Cycle ${cycleId} accepted.`,
    trigger: "manual",
  });
  await appendProgressRow(context.progressFile, now, "Cycle", `${cycleId} accepted`, "Cycle accepted");
  return { cycle, state, archived: options.archive === true };
}

export async function rejectCycle(projectRoot = ".", options = {}) {
  const context = await loadAcceptanceContext(projectRoot);
  const now = options.now || new Date().toISOString();
  const cycleId = cycleIdentifier(context.cycle);
  const feedbackRef = options.feedback_ref || `.pipeline/acceptance/cycle-${cycleId}-rejection-${compactTimestamp(now)}.yaml`;
  const cycle = {
    ...context.cycle,
    cycle: {
      ...context.cycle.cycle,
      status: "active",
      acceptance: {
        ...(context.cycle.cycle?.acceptance || {}),
        state: "rejected",
        rejected_at: now,
        feedback_ref: feedbackRef,
      },
    },
  };
  const state = {
    ...context.state,
    pipeline: {
      ...(context.state.pipeline || {}),
      status: "running",
    },
    current: {
      ...(context.state.current || {}),
      phase: "executing",
    },
    acceptance: compactAcceptanceState({
      scope: "cycle",
      state: "rejected",
      cycle_id: cycleId,
      feedback_ref: feedbackRef,
      updated_at: now,
    }),
  };

  await mkdir(join(projectRoot, ".pipeline", "acceptance"), { recursive: true });
  await writeConfig(join(projectRoot, feedbackRef), {
    ...createRejectionFeedbackTemplate({
      scope: "cycle",
      ref: cycleId,
      iteration: Number(context.cycle.cycle?.acceptance?.iteration || 1),
      created_at: now,
      context: options.context || `Cycle ${cycleId} acceptance`,
    }),
    rejected_at: now,
    problem: String(options.feedback || "").trim(),
    feedback: String(options.feedback || "").trim(),
  });
  await persistAcceptanceContext(context, { cycle, state });
  await appendLifecycleLog(context.logFile, {
    id: `CYCLE-REJECTED-${cycleId}-${compactTimestamp(now)}`,
    type: "cycle_reject",
    ref: cycleId,
    status: "rejected",
    timestamp: now,
    summary: `Cycle ${cycleId} rejected; feedback stored at ${feedbackRef}.`,
    report: feedbackRef,
    trigger: "manual",
  });
  await appendProgressRow(context.progressFile, now, "Cycle", `${cycleId} rejected`, `反馈已保存到 ${feedbackRef}`);
  return { cycle, state, feedback_ref: feedbackRef };
}

async function loadAcceptanceContext(projectRoot) {
  const pipelineDir = join(projectRoot, ".pipeline");
  return {
    projectRoot,
    cycleFile: join(pipelineDir, "cycle.yaml"),
    stateFile: join(pipelineDir, "state.yaml"),
    logFile: join(pipelineDir, "log.yaml"),
    progressFile: join(pipelineDir, "PROGRESS.md"),
    cycle: await readYaml(join(pipelineDir, "cycle.yaml")),
    state: await readYaml(join(pipelineDir, "state.yaml")),
  };
}

async function persistAcceptanceContext(context, { cycle, state }) {
  await writeConfig(context.cycleFile, cycle);
  await writeConfig(context.stateFile, state);
}

async function readYaml(file) {
  try {
    return parseYaml(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function appendLifecycleLog(file, entry) {
  const log = await readYaml(file);
  const entries = Array.isArray(log.entries) ? log.entries : [];
  await writeConfig(file, {
    ...log,
    entries: [entry, ...entries],
  });
}

async function appendProgressRow(file, timestamp, type, event, result) {
  let source = "";
  try {
    source = await readFile(file, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const row = `| ${formatProgressTime(timestamp)} | ${type} | ${event} | ${result} |`;
  if (source.includes("| 时间 | 类型 | 事件 | 结果 |")) {
    const marker = "|---|---|---|---|";
    const index = source.indexOf(marker);
    const insertAt = index === -1 ? source.length : index + marker.length;
    const updated = `${source.slice(0, insertAt)}\n${row}${source.slice(insertAt)}`;
    await writeFile(file, updated, "utf8");
    return;
  }
  await writeFile(file, `${source.trimEnd()}\n\n## 时间线\n\n| 时间 | 类型 | 事件 | 结果 |\n|---|---|---|---|\n${row}\n`, "utf8");
}

function compactAcceptanceState(value) {
  const allowed = ["scope", "state", "mode", "cycle_id", "feedback_ref", "updated_at"];
  return Object.fromEntries(allowed.filter((key) => value[key] !== undefined).map((key) => [key, value[key]]));
}

function normalizeAcceptanceMode(value) {
  return ["manual", "auto", "timeout", "confirm"].includes(value) ? value : DEFAULT_GLOBAL_CONFIG.acceptance.mode;
}

function normalizeAcceptanceState(value) {
  return ["pending", "accepted", "rejected"].includes(value) ? value : DEFAULT_GLOBAL_CONFIG.acceptance.default_state;
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function positiveInteger(value, fallback) {
  return Math.max(1, Math.trunc(positiveNumber(value, fallback)));
}

function cycleIdentifier(cycle = {}) {
  const number = cycle.cycle?.number || cycle.number || null;
  return number ? `C${number}` : "C?";
}

function compactTimestamp(value) {
  return String(value)
    .replace(/[-:]/g, "")
    .replace(/\.\d+/, "")
    .replace(/\+/, "+")
    .replace(/Z$/, "Z");
}

function formatProgressTime(value) {
  const match = /T(\d{2}:\d{2})/.exec(String(value));
  return match?.[1] || String(value);
}
