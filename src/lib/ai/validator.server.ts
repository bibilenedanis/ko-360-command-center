import type {
  ReportOutput,
  ReportOutputSummary,
  ReportOutputConfidence,
  ReportOutputNextSprintFocusItem,
} from "./schema";
import type { PromptOutput } from "@/lib/report/prompt.types";

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: string[],
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateReportOutput(output: PromptOutput): ReportOutput {
  const errors: string[] = [];
  const text = output.text.trim();

  if (!text) {
    throw new ValidationError("Response is empty", ["Response is empty"]);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new ValidationError("Response is not valid JSON", [
      "Response could not be parsed as JSON",
    ]);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new ValidationError("Response is not a JSON object", [
      "Response must be a JSON object",
    ]);
  }

  const obj = parsed as Record<string, unknown>;

  const summary = validateSummary(obj.summary, errors);
  const strengths = validateStringArray(obj.strengths, "strengths", errors);
  const challenges = validateStringArray(obj.challenges, "challenges", errors);
  const coachNotes = validateString(obj.coachNotes, "coachNotes", errors);
  const nextSprintFocus = validateNextSprintFocus(
    obj.nextSprintFocus,
    errors,
  );
  const confidence = validateConfidence(obj.confidence, errors);

  if (errors.length > 0) {
    throw new ValidationError(
      `Response validation failed with ${errors.length} error(s)`,
      errors,
    );
  }

  return {
    summary,
    strengths,
    challenges,
    coachNotes,
    nextSprintFocus,
    confidence,
  };
}

function validateSummary(
  value: unknown,
  errors: string[],
): ReportOutputSummary {
  if (!value || typeof value !== "object") {
    errors.push("summary is missing or not an object");
    return { currentStatus: "", keyInsight: "", recommendedFocus: "" };
  }

  const obj = value as Record<string, unknown>;

  const currentStatus = validateString(obj.currentStatus, "summary.currentStatus", errors);
  const keyInsight = validateString(obj.keyInsight, "summary.keyInsight", errors);
  const recommendedFocus = validateString(obj.recommendedFocus, "summary.recommendedFocus", errors);

  return { currentStatus, keyInsight, recommendedFocus };
}

function validateStringArray(
  value: unknown,
  fieldName: string,
  errors: string[],
): string[] {
  if (!Array.isArray(value)) {
    errors.push(`${fieldName} is missing or not an array`);
    return [];
  }

  const result: string[] = [];
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    if (typeof item !== "string" || !item.trim()) {
      errors.push(`${fieldName}[${i}] must be a non-empty string`);
    } else {
      result.push(item.trim());
    }
  }

  return result;
}

function validateString(
  value: unknown,
  fieldName: string,
  errors: string[],
): string {
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${fieldName} is missing or not a non-empty string`);
    return "";
  }
  return value.trim();
}

function validateNextSprintFocus(
  value: unknown,
  errors: string[],
): ReportOutputNextSprintFocusItem[] {
  if (!Array.isArray(value)) {
    errors.push("nextSprintFocus is missing or not an array");
    return [];
  }

  const result: ReportOutputNextSprintFocusItem[] = [];
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    if (!item || typeof item !== "object") {
      errors.push(`nextSprintFocus[${i}] must be an object`);
      continue;
    }

    const obj = item as Record<string, unknown>;
    const title = typeof obj.title === "string" && obj.title.trim() ? obj.title.trim() : null;
    const description = typeof obj.description === "string" && obj.description.trim() ? obj.description.trim() : null;

    if (!title) {
      errors.push(`nextSprintFocus[${i}].title must be a non-empty string`);
    }
    if (!description) {
      errors.push(`nextSprintFocus[${i}].description must be a non-empty string`);
    }

    if (title && description) {
      result.push({ title, description });
    }
  }

  return result;
}

function validateConfidence(
  value: unknown,
  errors: string[],
): ReportOutputConfidence {
  if (!value || typeof value !== "object") {
    errors.push("confidence is missing or not an object");
    return { score: 0, missingInformation: [], suggestions: [] };
  }

  const obj = value as Record<string, unknown>;

  let score = 0;
  if (typeof obj.score !== "number" || obj.score < 0 || obj.score > 1) {
    errors.push("confidence.score must be a number between 0 and 1");
  } else {
    score = obj.score;
  }

  const missingInformation = validateStringArray(
    obj.missingInformation,
    "confidence.missingInformation",
    errors,
  );
  const suggestions = validateStringArray(
    obj.suggestions,
    "confidence.suggestions",
    errors,
  );

  return { score, missingInformation, suggestions };
}
