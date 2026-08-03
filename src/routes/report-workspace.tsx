import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ReportShell } from "@/components/report-workspace/ReportShell";
import { ReportHeader } from "@/components/report-workspace/ReportHeader";
import { AISummaryCard } from "@/components/report-workspace/AISummaryCard";
import { TagCard } from "@/components/report-workspace/TagCard";
import { CoachNotesCard } from "@/components/report-workspace/CoachNotesCard";
import { SprintFocusCard } from "@/components/report-workspace/SprintFocusCard";
import { VersionHistoryTimeline } from "@/components/report-workspace/VersionHistoryTimeline";
import { AISourcesPanel } from "@/components/report-workspace/AISourcesPanel";
import { AIConfidencePanel } from "@/components/report-workspace/AIConfidencePanel";
import { QuickActionsPanel } from "@/components/report-workspace/QuickActionsPanel";
import { BottomActionBar } from "@/components/report-workspace/BottomActionBar";
import { getReportWorkspaceData } from "@/lib/report/report.server";
import {
  getUsedSources,
  getMissingSources,
  getVersionHistory,
} from "@/lib/report/report.mapper";
import type { ReportWorkspaceData } from "@/lib/report/report.types";
import { generateReportOutput, ValidationError } from "@/lib/report/generate.server";
import type { ReportOutput } from "@/lib/ai/schema";
import { mapReportOutputToWorkspaceData } from "@/lib/report/report-output.mapper";

const loadReportWorkspace = createServerFn({ method: "GET" }).handler(
  async (): Promise<ReportWorkspaceData> => {
    return await getReportWorkspaceData();
  },
);

export const Route = createFileRoute("/report-workspace")({
  loader: async () => {
    return await loadReportWorkspace();
  },
  head: () => ({
    meta: [
      { title: "Report Workspace — Koç360" },
      {
        name: "description",
        content: "Koç360 report builder workspace.",
      },
    ],
  }),
  component: ReportWorkspacePage,
});

function ReportWorkspacePage() {
  const data = Route.useLoaderData() as ReportWorkspaceData;
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportOutput, setReportOutput] = useState<ReportOutput | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const usedSources = getUsedSources(data);
  const missingSources = getMissingSources(data);
  const versionHistory = getVersionHistory(data);

  const handleGenerateAgain = async () => {
    setIsGenerating(true);
    try {
      const output = await generateReportOutput({ data: { sessionId: data.session.id } });
      setReportOutput(output);
      setGeneratedAt(new Date().toISOString());
      toast.success("Report generated successfully.");
    } catch (error) {
      console.error("Failed to generate report:", error);
      if (error instanceof ValidationError) {
        toast.error("Report validation failed: " + error.errors.join(", "));
      } else if (error instanceof Error) {
        toast.error("Report generation failed: " + error.message);
      } else {
        toast.error("Report generation failed.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const displayData = reportOutput
    ? mapReportOutputToWorkspaceData(reportOutput, data, generatedAt || undefined)
    : data;

  return (
    <ReportShell reportStatus={displayData.report.metadata.reportStatus}>
      <ReportHeader
        studentName={displayData.student.name}
        sessionDate={displayData.session.date}
        sprintName={displayData.sprint.name}
        goal={displayData.sprint.goal}
        completionPercent={displayData.report.metadata.completionPercent}
        readingTimeMinutes={displayData.report.metadata.readingTimeMinutes}
        lastGeneratedAt={displayData.report.metadata.lastGeneratedAt}
        reportStatus={displayData.report.metadata.reportStatus}
        draftLabel={displayData.report.metadata.draftLabel}
        reviewLabel={displayData.report.metadata.reviewLabel}
        isGenerating={isGenerating}
        onGenerateAgain={handleGenerateAgain}
      />

      <div className="max-w-[1400px] mx-auto p-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AISummaryCard sections={displayData.report.summary} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TagCard
              title="Strengths"
              icon="add"
              items={displayData.report.strengths}
              variant="strength"
            />
            <TagCard
              title="Challenges"
              icon="warning"
              items={displayData.report.challenges}
              variant="challenge"
            />
          </div>

          <CoachNotesCard value={displayData.report.coachNotes} />

          <SprintFocusCard items={displayData.report.sprintFocus} />

          <VersionHistoryTimeline events={getVersionHistory(displayData)} />
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-8">
          <AISourcesPanel
            usedSources={getUsedSources(displayData)}
            missingSources={getMissingSources(displayData)}
          />

          <AIConfidencePanel
            confidence={displayData.confidence.confidence}
            missingSources={displayData.confidence.missingSources}
            suggestions={displayData.confidence.suggestions}
            readiness={displayData.publishing.readiness}
            readinessLabel={displayData.publishing.readinessLabel}
          />

          <QuickActionsPanel />
        </aside>
      </div>

      <BottomActionBar />
    </ReportShell>
  );
}
