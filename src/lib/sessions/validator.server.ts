import type { PromptOutput } from "@/lib/report/prompt.types";
import { SessionBriefSchema } from "./brief.schema";
import type { SessionBrief } from "./brief.schema";

export class SessionBriefValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: string[]
  ) {
    super(message);
    this.name = "SessionBriefValidationError";
  }
}

export function validateSessionBrief(output: PromptOutput): SessionBrief {
  const errors: string[] = [];

  const parsed = safeJsonParse(output.text, errors);
  if (!parsed) {
    throw new SessionBriefValidationError(
      "Session brief is not valid JSON",
      errors
    );
  }

  const zodResult = SessionBriefSchema.safeParse(parsed);
  if (!zodResult.success) {
    for (const issue of zodResult.error.issues) {
      errors.push(`${issue.path.join(".")}: ${issue.message}`);
    }
    throw new SessionBriefValidationError(
      "Session brief schema validation failed",
      errors
    );
  }

  runBusinessValidation(zodResult.data, errors);
  if (errors.length > 0) {
    throw new SessionBriefValidationError(
      "Session brief business validation failed",
      errors
    );
  }

  return zodResult.data;
}

function safeJsonParse(text: string, errors: string[]): unknown | null {
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    errors.push("Response is not valid JSON");
    return null;
  }
}

function runBusinessValidation(brief: SessionBrief, errors: string[]): void {
  if (brief.risks.length === 0) {
    errors.push("risks: At least one risk must be identified");
  }

  if (brief.opportunities.length === 0) {
    errors.push("opportunities: At least one opportunity must be identified");
  }

  if (brief.recommendedDiscussionTopics.length === 0) {
    errors.push(
      "recommendedDiscussionTopics: At least one discussion topic must be provided"
    );
  }

  if (brief.recommendedActions.length === 0) {
    errors.push(
      "recommendedActions: At least one recommended action must be provided"
    );
  }

  if (brief.confidence < 0.5) {
    errors.push(
      "confidence: Confidence score is below 0.5, indicating low reliability"
    );
  }
}
