import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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
import { buildReportContext } from "@/lib/report/context.server";
import { buildReportPrompt } from "@/lib/report/prompt.builder";

const loadReportWorkspace = createServerFn({ method: "GET" }).handler(
  async (): Promise<ReportWorkspaceData> => {
    // Temporary test: Build and log a prompt from a real session
    // This will be removed after testing
    try {
      // Try to build a context from a test session ID
      // Note: This will fail if the session doesn't exist in your Notion database
      // You may need to replace this with a real session ID from your database
      const testSessionId = "test-session-id"; // Replace with actual session ID
      
      console.log("[Prompt Builder Test] Building ReportContext...");
      const context = await buildReportContext(testSessionId);
      
      console.log("[Prompt Builder Test] Building prompt...");
      const prompt = buildReportPrompt(context);
      
      console.log("[Prompt Builder Test] Generated prompt:");
      console.log("System prompt length:", prompt.system.length, "characters");
      console.log("User prompt length:", prompt.user.length, "characters");
      console.log("Total word count:", prompt.metadata.wordCount);
      console.log("Available sources:", prompt.metadata.availableSources);
      console.log("Missing sources:", prompt.metadata.missingSources);
      console.log("\n--- SYSTEM PROMPT ---\n");
      console.log(prompt.system);
      console.log("\n--- USER PROMPT (first 2000 chars) ---\n");
      console.log(prompt.user.substring(0, 2000));
      console.log("\n--- END PROMPT PREVIEW ---\n");
    } catch (error) {
      console.log("[Prompt Builder Test] Could not build prompt from real data:", error instanceof Error ? error.message : error);
      console.log("[Prompt Builder Test] This is expected if using placeholder data or invalid session ID");
    }
    
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
  const usedSources = getUsedSources(data);
  const missingSources = getMissingSources(data);
  const versionHistory = getVersionHistory(data);

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
