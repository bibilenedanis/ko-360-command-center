import { z } from "zod";

export const ReportOutputSummarySchema = z.object({
  currentStatus: z.string().min(1, "currentStatus must be a non-empty string"),
  keyInsight: z.string().min(1, "keyInsight must be a non-empty string"),
  recommendedFocus: z
    .string()
    .min(1, "recommendedFocus must be a non-empty string"),
});

export const ReportOutputNextSprintFocusItemSchema = z.object({
  title: z.string().min(1, "title must be a non-empty string"),
  description: z.string().min(1, "description must be a non-empty string"),
});

export const ReportOutputConfidenceSchema = z.object({
  score: z.number().min(0).max(1),
  missingInformation: z.array(z.string().min(1)),
  suggestions: z.array(z.string().min(1)),
});

export const ReportOutputSchema = z.object({
  summary: ReportOutputSummarySchema,
  strengths: z.array(z.string().min(1)).min(1, "strengths must not be empty"),
  challenges: z
    .array(z.string().min(1))
    .min(1, "challenges must not be empty"),
  coachNotes: z.string().min(1, "coachNotes must be a non-empty string"),
  nextSprintFocus: z.array(ReportOutputNextSprintFocusItemSchema),
  confidence: ReportOutputConfidenceSchema,
});

export type ReportOutput = z.infer<typeof ReportOutputSchema>;
export type ReportOutputSummary = z.infer<typeof ReportOutputSummarySchema>;
export type ReportOutputNextSprintFocusItem = z.infer<
  typeof ReportOutputNextSprintFocusItemSchema
>;
export type ReportOutputConfidence = z.infer<
  typeof ReportOutputConfidenceSchema
>;

export function getReportOutputSchemaJson(): string {
  return JSON.stringify(
    {
      summary: {
        currentStatus:
          "string — one-sentence summary of the student's current standing",
        keyInsight:
          "string — the single most important observation from available data",
        recommendedFocus: "string — what the student should prioritize next",
      },
      strengths: [
        "string — evidence-based strength, grounded in provided data",
        "string — another strength",
      ],
      challenges: [
        "string — evidence-based challenge, grounded in provided data",
        "string — another challenge",
      ],
      coachNotes:
        "string — private observations for the coach, candid and actionable",
      nextSprintFocus: [
        {
          title: "string — short label for the focus area",
          description: "string — what to do and why",
        },
      ],
      confidence: {
        score: "number between 0 and 1",
        missingInformation: ["string — what data was missing"],
        suggestions: ["string — what to do to improve confidence"],
      },
    },
    null,
    2,
  );
}
