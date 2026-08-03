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

const loadReportWorkspace = createServerFn({ method: "GET" }).handler(async () => {
  return {
    studentName: "Ali Yılmaz",
    sessionDate: "24 Oct 2023",
    sprint: "Sprint 12",
    goal: "Academic Resilience & Time Mgmt",
    completionPercent: 92,
    readingTimeMinutes: 2,
    aiSummary: [
      {
        label: "Current Status",
        content:
          "Ali has shown significant progress in Sprint 12, specifically regarding his focus on college application deadlines. Engagement improved from 'passive' to 'active'.",
      },
      {
        label: "Key Insight",
        content:
          "AI analysis suggests a 15% increase in task completion rate, indicating a strong shift towards self-regulation.",
      },
      {
        label: "Recommended Focus",
        content:
          "Maintain momentum through the upcoming physics project while introducing structured morning routines.",
      },
    ],
    strengths: [
      "Strong ownership",
      "Improved consistency",
      "Self-directed learning",
      "Exam resilience",
    ],
    challenges: [
      "Morning fatigue",
      "Exam anxiety",
      "Low accountability",
      "Time management",
    ],
    coachNotes:
      "Ali seemed distracted when discussing his physics project. He might need a follow-up session focusing purely on project breakdown steps to avoid overwhelm.",
    sprintFocus: [
      {
        title: "Finalize Physics Lab Report",
        detail: "Deadline: Nov 2nd",
      },
      {
        title: "Mock TOEFL Test - Session 1",
        detail: "Preparation: Review vocabulary lists",
      },
    ],
    versionHistory: [
      {
        title: "Viewed",
        timestamp: "OCT 26, 09:15",
        actor: "By Parent",
        isLatest: true,
      },
      {
        title: "Shared with Parent",
        timestamp: "OCT 25, 18:00",
        actor: "System Action",
      },
      {
        title: "Published",
        timestamp: "OCT 25, 17:45",
        actor: "By Coach Sarah",
      },
      {
        title: "Approved",
        timestamp: "OCT 25, 16:20",
        actor: "By Head Coach",
      },
      {
        title: "Coach Edited",
        timestamp: "OCT 25, 14:30",
        actor: "By Coach Sarah",
      },
      {
        title: "AI Draft Created",
        timestamp: "OCT 25, 14:00",
        actor: "System",
      },
    ],
    usedSources: [
      "Session Notes",
      "Sprint Log",
      "Tasks",
      "Assessment",
      "Commitments",
    ],
    missingSources: ["Parent Feedback", "Latest Assessment"],
    confidencePercent: 88,
    missingInfo: ["Parent goals for this sprint are not updated."],
    suggestion: 'Ask Ali about "Math Anxiety" for deeper analysis.',
    readinessPercent: 92,
    readinessLabel: "Ready to Publish",
    quickActions: [
      {
        icon: "picture_as_pdf",
        title: "Export PDF",
        description: "Create printable version",
      },
      {
        icon: "family_restroom",
        title: "Parent Version",
        description: "Hide coach-only notes",
      },
      {
        icon: "person",
        title: "Student Version",
        description: "Student-friendly wording",
      },
      {
        icon: "share",
        title: "Share Report",
        description: "Generate secure share link",
      },
    ],
  };
});

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
  const data = Route.useLoaderData();

  return (
    <ReportShell>
      <ReportHeader
        studentName={data.studentName}
        sessionDate={data.sessionDate}
        sprint={data.sprint}
        goal={data.goal}
        completionPercent={data.completionPercent}
        readingTimeMinutes={data.readingTimeMinutes}
      />

      <div className="max-w-[1400px] mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Document Canvas (70%) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <AISummaryCard sections={data.aiSummary} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TagCard
              title="Strengths"
              icon="add"
              items={data.strengths}
              variant="strength"
            />
            <TagCard
              title="Challenges"
              icon="warning"
              items={data.challenges}
              variant="challenge"
            />
          </div>

          <CoachNotesCard value={data.coachNotes} />

          <SprintFocusCard items={data.sprintFocus} />

          <VersionHistoryTimeline events={data.versionHistory} />
        </div>

        {/* Side Workspace (30%) */}
        <aside className="col-span-12 lg:col-span-4 space-y-8">
          <AISourcesPanel
            usedSources={data.usedSources}
            missingSources={data.missingSources}
          />

          <AIConfidencePanel
            confidencePercent={data.confidencePercent}
            missingInfo={data.missingInfo}
            suggestion={data.suggestion}
            readinessPercent={data.readinessPercent}
            readinessLabel={data.readinessLabel}
          />

          <QuickActionsPanel actions={data.quickActions} />
        </aside>
      </div>

      <BottomActionBar />
    </ReportShell>
  );
}
