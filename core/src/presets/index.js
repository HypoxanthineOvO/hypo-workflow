export const PRESET_STEP_SEQUENCES = Object.freeze({
  tdd: Object.freeze([
    "write_tests",
    "review_tests",
    "run_tests_red",
    "implement",
    "run_tests_green",
    "review_code",
  ]),
  "implement-only": Object.freeze([
    "implement",
    "run_tests",
    "review_code",
  ]),
  analysis: Object.freeze([
    "define_question",
    "gather_context",
    "hypothesize",
    "experiment",
    "interpret",
    "conclude",
  ]),
});

export function normalizePreset(value = "tdd") {
  const normalized = String(value || "tdd").trim();
  if (normalized === "tdd" || normalized === "implement-only" || normalized === "custom" || normalized === "analysis") {
    return normalized;
  }
  return "tdd";
}

export function stepSequenceForPreset(value = "tdd", options = {}) {
  const preset = normalizePreset(value);
  if (preset === "custom") {
    return Array.isArray(options.sequence) ? options.sequence.map(String).filter(Boolean) : [];
  }
  return [...PRESET_STEP_SEQUENCES[preset]];
}
