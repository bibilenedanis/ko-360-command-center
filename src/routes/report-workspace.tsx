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
import { generateReportPrompt } from "@/lib/report/generate.server";

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
  const usedSources = getUsedSources(data);
  const missingSources = getMissingSources(data);
  const versionHistory = getVersionHistory(data);

  const handleGenerateAgain = async () => {
    setIsGenerating(true);
    try {
      await generateReportPrompt({ data: { sessionId: data.session.id } });
      toast.success("Prompt generated.");
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      toast.error("Prompt generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ReportShell reportStatus={data.report.metadata.reportStatus}>
      <ReportHeader
        studentName={data.student.name}
        sessionDate={data.session.date}
        sprintName={data.sprint.name}
        goal={data.sprint.goal}
        completionPercent={data.report.metadata.completionPercent}
        readingTimeMinutes={data.report.metadata.readingTimeMinutes}
        lastGeneratedAt={data.report.metadata.lastGeneratedAt}
        reportStatus={data.report.metadata.reportStatus}
        draftLabel={data.report.metadata.draftLabel}
        reviewLabel={data.report.metadata.reviewLabel}
        isGenerating={isGenerating}
        onGenerateAgain={handleGenerateAgain}
      />

      <div className="max-w-[1400px] mx-auto p-4 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AISummaryCard sections={data.report.summary} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TagCard
              title="Strengths"
              icon="add"
              items={data.report.strengths}
              variant="strength"
            />
            <TagCard
              title="Challenges"
              icon="warning"
              items={data.report.challenges}
              variant="challenge"
            />
          </div>

          <CoachNotesCard value={data.report.coachNotes} />

          <SprintFocusCard items={data.report.sprintFocus} />

          <VersionHistoryTimeline events={versionHistory} />
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-8">
          <AISourcesPanel
            usedSources={usedSources}
            missingSources={missingSources}
          />

          <AIConfidencePanel
            confidence={data.confidence.confidence}
            missingSources={data.confidence.missingSources}
            suggestions={data.confidence.suggestions}
            readiness={data.publishing.readiness}
            readinessLabel={data.publishing.readinessLabel}
          />

          <QuickActionsPanel />
        </aside>
      </div>

      <BottomActionBar />
    </ReportShell>
  );
}
