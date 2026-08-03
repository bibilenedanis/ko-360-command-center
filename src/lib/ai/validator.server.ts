import { ZodError } from "zod";
import { ReportOutputSchema } from "./report-output.schema";
import type { ReportOutput } from "./report-output.schema";
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

export interface BusinessValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  output: ReportOutput;
  businessIssues: BusinessValidationIssue[];
}

export function validateReportOutput(output: PromptOutput): ReportOutput {
  const text = output.text.trim();

  if (!text) {
    throw new ValidationError("Response is empty", ["Response is empty"]);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ValidationError("Response is not valid JSON", [
      "Response could not be parsed as JSON",
    ]);
  }

  const zodResult = ReportOutputSchema.safeParse(parsed);

  if (!zodResult.success) {
    const errors = zodResult.error.errors.map(
      (e) => `${e.path.join(".") || "root"}: ${e.message}`,
    );
    throw new ValidationError(
      `Schema validation failed with ${errors.length} error(s)`,
      errors,
    );
  }

  const reportOutput = zodResult.data;

  const businessIssues = runBusinessValidation(reportOutput);
  const errors = businessIssues.filter((i) => i.severity === "error");

  if (errors.length > 0) {
    throw new ValidationError(
      `Business validation failed with ${errors.length} error(s)`,
      errors.map((e) => `[${e.field}] ${e.message}`),
    );
  }

  return reportOutput;
}

export function validateReportOutputWithWarnings(
  output: PromptOutput,
): ValidationResult {
  const reportOutput = validateReportOutput(output);
  const businessIssues = runBusinessValidation(reportOutput);

  return {
    output: reportOutput,
    businessIssues,
  };
}

function runBusinessValidation(output: ReportOutput): BusinessValidationIssue[] {
  const issues: BusinessValidationIssue[] = [];

  if (output.confidence.score < 0.5) {
    issues.push({
      field: "confidence.score",
      message: `Confidence score ${output.confidence.score} is below 0.5 — report quality may be insufficient`,
      severity: "warning",
    });
  }

  if (output.strengths.length < 2) {
    issues.push({
      field: "strengths",
      message: `Only ${output.strengths.length} strength(s) identified — consider regenerating for a more comprehensive report`,
      severity: "warning",
    });
  }

  if (output.challenges.length < 2) {
    issues.push({
      field: "challenges",
      message: `Only ${output.challenges.length} challenge(s) identified — consider regenerating for a more comprehensive report`,
      severity: "warning",
    });
  }

  if (output.summary.currentStatus.length < 20) {
    issues.push({
      field: "summary.currentStatus",
      message: "Current status is unusually short — may lack sufficient detail",
      severity: "warning",
    });
  }

  if (output.summary.keyInsight.length < 20) {
    issues.push({
      field: "summary.keyInsight",
      message: "Key insight is unusually short — may lack sufficient detail",
      severity: "warning",
    });
  }

  if (output.summary.recommendedFocus.length < 20) {
    issues.push({
      field: "summary.recommendedFocus",
      message: "Recommended focus is unusually short — may lack sufficient detail",
      severity: "warning",
    });
  }

  if (output.nextSprintFocus.length === 0) {
    issues.push({
      field: "nextSprintFocus",
      message: "No sprint focus items defined — at least one focus area is recommended",
      severity: "warning",
    });
  }

  for (let i = 0; i < output.nextSprintFocus.length; i++) {
    const item = output.nextSprintFocus[i];
    if (item.title.length > 100) {
      issues.push({
        field: `nextSprintFocus[${i}].title`,
        message: "Sprint focus title is unusually long (over 100 chars)",
        severity: "warning",
      });
    }
  }

  if (output.coachNotes.length < 10) {
    issues.push({
      field: "coachNotes",
      message: "Coach notes are unusually short",
      severity: "warning",
    });
  }

  return issues;
}
