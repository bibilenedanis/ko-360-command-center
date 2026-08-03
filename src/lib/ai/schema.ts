export interface ReportOutputSummary {
  currentStatus: string;
  keyInsight: string;
  recommendedFocus: string;
}

export interface ReportOutputNextSprintFocusItem {
  title: string;
  description: string;
}

export interface ReportOutputConfidence {
  score: number;
  missingInformation: string[];
  suggestions: string[];
}

export interface ReportOutput {
  summary: ReportOutputSummary;
  strengths: string[];
  challenges: string[];
  coachNotes: string;
  nextSprintFocus: ReportOutputNextSprintFocusItem[];
  confidence: ReportOutputConfidence;
}

export function getReportOutputSchemaJson(): string {
  return JSON.stringify(
    {
      summary: {
        currentStatus: "string — one-sentence summary of the student's current standing",
        keyInsight: "string — the single most important observation from available data",
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
