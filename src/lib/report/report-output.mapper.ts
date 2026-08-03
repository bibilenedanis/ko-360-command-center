import type { ReportOutput } from "@/lib/ai/schema";
import type {
  ReportWorkspaceData,
  ReportSummarySection,
  SprintFocusItem,
} from "@/lib/report/report.types";

export function mapReportOutputToWorkspaceData(
  output: ReportOutput,
  baseData: ReportWorkspaceData,
  generatedAt?: string,
): ReportWorkspaceData {
  const summary = buildSummarySections(output.summary);
  const strengths = [...output.strengths];
  const challenges = [...output.challenges];
  const sprintFocus = buildSprintFocus(output.nextSprintFocus);
  const confidence = Math.round(output.confidence.score * 100);

  return {
    ...baseData,
    report: {
      ...baseData.report,
      summary,
      strengths,
      challenges,
      coachNotes: output.coachNotes || baseData.report.coachNotes,
      sprintFocus,
      metadata: {
        ...baseData.report.metadata,
        lastGeneratedAt: generatedAt || new Date().toISOString(),
        completionPercent: confidence,
      },
    },
    confidence: {
      ...baseData.confidence,
      confidence,
      missingSources: output.confidence.missingInformation,
      suggestions: output.confidence.suggestions,
    },
  };
}

function buildSummarySections(
  summary: ReportOutput["summary"],
): ReportSummarySection[] {
  const sections: ReportSummarySection[] = [];

  if (summary.currentStatus) {
    sections.push({
      label: "Current Status",
      content: summary.currentStatus,
    });
  }

  if (summary.keyInsight) {
    sections.push({
      label: "Key Insight",
      content: summary.keyInsight,
    });
  }

  if (summary.recommendedFocus) {
    sections.push({
      label: "Recommended Focus",
      content: summary.recommendedFocus,
    });
  }

  return sections;
}

function buildSprintFocus(
  items: ReportOutput["nextSprintFocus"],
): SprintFocusItem[] {
  return items.map((item) => ({
    title: item.title,
    detail: item.description,
  }));
}
