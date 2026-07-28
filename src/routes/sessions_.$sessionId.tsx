import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { Icon } from "@/components/icon";
import { SessionHeader } from "@/components/session-workspace/SessionHeader";
import { CoachingFlowStrip } from "@/components/session-workspace/CoachingFlowStrip";
import { AIBriefingPanel } from "@/components/session-workspace/AIBriefingPanel";
import { StudentContextPanel } from "@/components/session-workspace/StudentContextPanel";
import { SessionNotesPanel } from "@/components/session-workspace/SessionNotesPanel";
import { SessionAgendaPanel } from "@/components/session-workspace/SessionAgendaPanel";
import { AIInsightsPanel } from "@/components/session-workspace/AIInsightsPanel";
import { SessionTasksPanel } from "@/components/session-workspace/SessionTasksPanel";
import {
  getSessionWorkspaceData,
  type SessionWorkspaceResult,
} from "@/lib/sessions/workspace.server";

export const Route = createFileRoute("/sessions_/$sessionId")({
  loader: async ({ params }) => {
    return await getSessionWorkspaceData(params.sessionId);
  },
  head: () => ({
    meta: [
      { title: "Görüşme Alanı — Koç360" },
      {
        name: "description",
        content: "Koç360 görüşme alanı: öğrenci bağlamı ve AI içgörüleri.",
      },
    ],
  }),
  component: SessionWorkspacePage,
});

function SessionWorkspacePage() {
  const result = Route.useLoaderData() as SessionWorkspaceResult;

  if (!result.ok) {
    return (
      <AppShell>
        <UnavailableState reason={result.reason} message={result.message} />
      </AppShell>
    );
  }

  const { session, profile, context } = result.data;
  const { student, summary } = profile;

  return (
    <AppShell>
      <div className="space-y-6">
        <SessionHeader
          session={session}
          studentId={student.id}
          studentName={student.name}
          studentEducationLevel={student.educationLevel}
          studentAttentionStatus={student.attentionStatus}
          openGoalCount={summary.openGoals}
          activeGoalProgress={context.activeGoal?.progress ?? null}
          activeSprintProgress={context.activeSprint?.progress ?? null}
        />

        <CoachingFlowStrip activeStep="session" />

        <AIBriefingPanel data={result.data} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Notes (widest) */}
          <div className="lg:col-span-6">
            <SessionNotesPanel />
          </div>

          {/* Center: Agenda + Snapshot + Tasks */}
          <div className="space-y-6 lg:col-span-3">
            <SessionAgendaPanel
              activeSprint={context.activeSprint}
              activeGoal={context.activeGoal}
              overdueTasks={context.overdueTasks}
            />
            <StudentContextPanel
              activeGoal={context.activeGoal}
              activeSprint={context.activeSprint}
              recentAssessment={context.recentAssessment}
            />
            <SessionTasksPanel
              overdue={context.overdueTasks}
              upcoming={context.upcomingTasks}
              other={context.otherTasks}
            />
          </div>

          {/* Right: AI Insights */}
          <div className="lg:col-span-3">
            <AIInsightsPanel
              pending={context.pendingHighRiskAI}
              others={context.otherAI}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function UnavailableState({
  reason,
  message,
}: {
  reason: "session_not_found" | "student_missing" | "load_failed";
  message: string;
}) {
  const title =
    reason === "session_not_found"
      ? "Görüşme bulunamadı"
      : reason === "student_missing"
        ? "Öğrenci ilişkisi eksik"
        : "Görüşme yüklenemedi";

  return (
    <div className="space-y-4">
      <Link
        to="/students"
        search={{ filter: "all" }}
        className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant transition-opacity hover:opacity-70"
      >
        <Icon name="arrow_back" className="text-[14px]" />
        Öğrencilere Dön
      </Link>
      <div className="border border-outline-variant bg-surface-lowest p-8 text-center">
        <Icon
          name="error_outline"
          className="text-[28px] text-on-surface-variant"
        />
        <h1 className="mt-2 text-lg font-semibold text-on-surface">{title}</h1>
        <p className="mt-2 text-sm text-on-surface-variant">{message}</p>
      </div>
    </div>
  );
}
