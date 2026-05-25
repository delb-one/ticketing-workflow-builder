import type { DecisionOutcome, SimulationContext } from "./types";

type DecisionCondition = NonNullable<DecisionOutcome["condition"]>;

const getContextVariableValue = (
  variables: SimulationContext["variables"],
  field: string,
): unknown => {
  const normalizedField = field.trim();
  if (!normalizedField) return undefined;

  const directValue = variables[normalizedField];
  if (directValue !== undefined) return directValue;

  const path = normalizedField.startsWith("context.variables.")
    ? normalizedField.replace(/^context\.variables\./, "")
    : normalizedField;

  if (!path.includes(".")) {
    return variables[path];
  }

  const segments = path.split(".");
  let current: unknown = variables;
  for (const segment of segments) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
};

const coerceNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

export const evaluateCondition = (
  condition: DecisionCondition | undefined,
  variables: SimulationContext["variables"],
): boolean => {
  if (!condition) return false;

  const actualValue = getContextVariableValue(variables, condition.field);
  const expectedValue = condition.value;

  switch (condition.operator) {
    case "equals":
      if (actualValue === undefined || actualValue === null) return false;
      return String(actualValue).trim().toLowerCase() === String(expectedValue).trim().toLowerCase();
    case "includes": {
      if (actualValue === undefined || actualValue === null) return false;
      const actualText = String(actualValue).toLowerCase();
      const expectedText = String(expectedValue).toLowerCase();
      return actualText.includes(expectedText);
    }
    case "gt": {
      const actualNumber = coerceNumber(actualValue);
      const expectedNumber = coerceNumber(expectedValue);
      return actualNumber !== undefined &&
        expectedNumber !== undefined &&
        actualNumber > expectedNumber;
    }
    case "lt": {
      const actualNumber = coerceNumber(actualValue);
      const expectedNumber = coerceNumber(expectedValue);
      return actualNumber !== undefined &&
        expectedNumber !== undefined &&
        actualNumber < expectedNumber;
    }
    default:
      return false;
  }
};

const sortOutcomesByPriority = (
  outcomes: DecisionOutcome[],
): DecisionOutcome[] =>
  [...outcomes].sort((a, b) => {
    const left = typeof a.priority === "number" ? a.priority : Number.POSITIVE_INFINITY;
    const right = typeof b.priority === "number" ? b.priority : Number.POSITIVE_INFINITY;
    return left - right;
  });

export const selectOutcomeByConditions = (
  outcomes: DecisionOutcome[],
  variables: SimulationContext["variables"],
): DecisionOutcome | undefined => {
  const ordered = sortOutcomesByPriority(outcomes);

  for (const outcome of ordered) {
    if (outcome.condition && evaluateCondition(outcome.condition, variables)) {
      return outcome;
    }
  }

  return ordered.find((outcome) => !outcome.condition);
};
