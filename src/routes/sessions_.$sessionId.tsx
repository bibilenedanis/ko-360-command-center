import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
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
  updateSessionNotes,
  type SessionWorkspaceResult,
} from "@/lib/sessions/workspace.server";
import { generateSessionBrief, SessionBriefValidationError } from "@/lib/sessions/generate.server";
import { getLatestSessionBrief } from "@/lib/sessions/repository.server";
import type { SessionBriefRecord } from "@/lib/sessions/repository.server";
import { mapSessionBriefToDisplayData } from "@/lib/sessions/mapper";

const loadSessionWorkspace = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("sessionId" in data) || typeof data.sessionId !== "string") {
      throw new Error("Invalid sessionId");
    }
    return data as { sessionId: string };
  })
  .handler(async ({ data }) => {
    const result = await getSessionWorkspaceData(data.sessionId);
    if (!result.ok) return result;

    const latestBrief = await getLatestSessionBrief(data.sessionId);
    return { ok: true as const, data: result.data, latestBrief };
  });

const saveSessionNotes = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (
      !data ||
      typeof data !== "object" ||
      !("sessionId" in data) ||
      typeof data.sessionId !== "string" ||
      data.sessionId.length === 0 ||
      !("winsAndProgress" in data) ||
      typeof data.winsAndProgress !== "string" ||
      !("challengesAndObstacles" in data) ||
      typeof data.challengesAndObstacles !== "string" ||
      !("coreNotes" in data) ||
      typeof data.coreNotes !== "string" ||
      !("commitments" in data) ||
      typeof data.commitments !== "string"
    ) {
      throw new Error("Invalid input");
    }
    return data as {
      sessionId: string;
      winsAndProgress: string;
      challengesAndObstacles: string;
      coreNotes: string;
      commitments: string;
    };
  })
  .handler(async ({ data }) => {
    return await updateSessionNotes(data);
  });

export const Route = createFileRoute("/sessions_/$sessionId")({
  loader: async ({ params }) => {
    return await loadSessionWorkspace({ data: { sessionId: params.sessionId } });
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

type SessionLoaderData =
  | { ok: true; data: SessionWorkspaceResult extends { ok: true; data: infer D } ? D : never; latestBrief: SessionBriefRecord | null }
  | { ok: false; reason: string; message: string };

function SessionWorkspacePage() {
  const result = Route.useLoaderData() as SessionLoaderData;

  if (!result.ok) {
    return (
      <AppShell>
        <UnavailableState reason={result.reason} message={result.message} />
      </AppShell>
    );
  }

  const { session, profile, context } = result.data;
  const { student, summary } = profile;

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentBrief, setCurrentBrief] = useState<SessionBriefRecord | null>(result.latestBrief);

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    try {
      const briefRecord = await generateSessionBrief({
        data: { sessionId: session.id },
      });
      setCurrentBrief(briefRecord);
      toast.success("Session brief generated successfully.");
    } catch (error) {
      console.error("Failed to generate session brief:", error);
      if (error instanceof SessionBriefValidationError) {
        toast.error("Brief validation failed: " + error.errors.join(", "));
      } else if (error instanceof Error) {
        toast.error("Brief generation failed: " + error.message);
      } else {
        toast.error("Brief generation failed.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const briefDisplayData = currentBrief
    ? mapSessionBriefToDisplayData(currentBrief.brief, currentBrief.createdAt)
    : null;

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

        <AIBriefingPanel
          data={result.data}
          briefData={briefDisplayData}
          isGenerating={isGenerating}
          onGenerateBrief={handleGenerateBrief}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* Left: Notes (~45%) */}
          <div className="md:col-span-2 lg:col-span-5">
            <SessionNotesPanel session={session} onSave={saveSessionNotes} />
          </div>

          {/* Center: Agenda + Snapshot (~30%) */}
          <div className="space-y-6 lg:col-span-4">
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
          </div>

          {/* Right: AI Insights + Tasks (~25%) */}
          <div className="space-y-6 lg:col-span-3">
            <AIInsightsPanel
              pending={context.pendingHighRiskAI}
              others={context.otherAI}
            />
            <SessionTasksPanel
              overdue={context.overdueTasks}
              upcoming={context.upcomingTasks}
              other={context.otherTasks}
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
  reason: string;
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
