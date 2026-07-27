import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { cn } from "@/lib/utils";

interface StudentMetricsProps {
  attentionStatus: string | null;
  goals: StudentProfileRecord[];
  sprints: StudentProfileRecord[];
  sessions: StudentProfileRecord[];
  summary: {
    openGoals: number;
    activeSprints: number;
    upcomingSessions: number;
    overdueTasks: number;
    pendingAIRecommendations: number;
  };
}

function isActiveSprint(status: string | null): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === "active" || s === "in progress" || s === "ongoing";
}

function nearestSession(sessions: StudentProfileRecord[]): StudentProfileRecord | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = sessions
    .filter((s) => s.date && new Date(s.date) >= today)
    .sort((a, b) => (a.date! < b.date! ? -1 : 1));
  return upcoming[0] ?? null;
}

function riskLabel(
  attention: string | null,
): { label: string; tone: "critical" | "elevated" | "stable" } {
  if (attention === "Critical") return { label: "Critical", tone: "critical" };
  if (attention === "Attention") return { label: "Elevated", tone: "elevated" };
  if (attention === "On Track") return { label: "Stable", tone: "stable" };
  return { label: "—", tone: "stable" };
}

function formatSessionDate(date: string): { day: string; month: string } {
  try {
    const d = new Date(date);
    return {
      day: d.toLocaleDateString("en-US", { day: "numeric" }),
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    };
  } catch {
    return { day: date, month: "" };
  }
}

/* ---------- State card ---------- */

interface StateCardProps {
  label: string;
  tone?: "critical" | "elevated" | "default";
  children: React.ReactNode;
}

function StateCard({ label, tone = "default", children }: StateCardProps) {
  return (
    <div
      className={cn(
        "flex h-32 flex-col justify-between border bg-surface-lowest p-4",
        tone === "critical" ? "border-destructive/50" : "border-outline-variant",
      )}
    >
      <span
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.08em]",
          tone === "critical" ? "text-destructive" : "text-on-surface-variant",
        )}
      >
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ---------- Analytical card ---------- */

interface AnalyticalCardProps {
  label: string;
  progressLabel?: string;
  progressValue?: number | null;
  children: React.ReactNode;
}

function AnalyticalCard({
  label,
  progressLabel,
  progressValue,
  children,
}: AnalyticalCardProps) {
  const hasProgress = progressValue !== null && progressValue !== undefined;
  return (
    <div className="flex flex-col justify-between border border-outline-variant bg-surface-lowest p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          {label}
        </h3>
        {progressLabel && (
          <span className="font-mono text-base font-semibold text-on-surface">
            {progressLabel}
          </span>
        )}
      </div>

      {hasProgress ? (
        <div className="my-4 h-1.5 bg-surface-high">
          <div
            className="h-full bg-primary"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      ) : (
        <div className="my-4 h-1.5 bg-surface-high/50" />
      )}

      {children}
    </div>
  );
}

/* ---------- Main component ---------- */

export function StudentMetrics({
  attentionStatus,
  goals,
  sprints,
  sessions,
  summary,
}: StudentMetricsProps) {
  const activeGoal = goals[0] ?? null;
  const activeSprint =
    sprints.find((s) => isActiveSprint(s.status)) ?? sprints[0] ?? null;
  const nextSession = nearestSession(sessions);
  const risk = riskLabel(attentionStatus);

  return (
    <div className="space-y-4">
      {/* Row 1: state cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StateCard label="Active Goal">
          {activeGoal ? (
            <p className="truncate text-lg font-semibold leading-tight text-on-surface">
              {activeGoal.title}
            </p>
          ) : (
            <p className="text-lg font-semibold leading-tight text-on-surface-variant">
              —
            </p>
          )}
        </StateCard>

        <StateCard label="Active Sprint">
          {activeSprint ? (
            <p className="truncate text-lg font-semibold leading-tight text-on-surface">
              {activeSprint.title}
            </p>
          ) : (
            <p className="text-lg font-semibold leading-tight text-on-surface-variant">
              —
            </p>
          )}
        </StateCard>

        <StateCard label="Risk Level" tone={risk.tone}>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-lg font-semibold leading-tight",
                risk.tone === "critical"
                  ? "text-destructive"
                  : "text-on-surface",
              )}
            >
              {risk.label}
            </span>
            {risk.tone === "critical" && (
              <span className="inline-block h-2 w-2 bg-destructive" />
            )}
          </div>
        </StateCard>

        <StateCard label="Next Session">
          {nextSession?.date ? (
            <div className="text-on-surface">
              <p className="text-lg font-semibold leading-tight">
                {(() => {
                  const { day, month } = formatSessionDate(nextSession.date);
                  return `${month} ${day}`;
                })()}
              </p>
              <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                {nextSession.title}
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold leading-tight text-on-surface-variant">
              —
            </p>
          )}
        </StateCard>
      </section>

      {/* Row 2: analytical / trajectory cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AnalyticalCard
          label="Goal Progress"
          progressLabel={
            activeGoal?.progress != null
              ? `${Math.round(Math.max(0, Math.min(100, activeGoal.progress)))}%`
              : undefined
          }
          progressValue={
            activeGoal?.progress != null
              ? Math.max(0, Math.min(100, activeGoal.progress))
              : null
          }
        >
          {activeGoal?.progress != null ? (
            <>
              <div className="flex justify-between text-[10px] font-mono uppercase text-on-surface-variant">
                <span>Current progress</span>
                <span>{Math.round(Math.max(0, Math.min(100, activeGoal.progress)))}%</span>
              </div>
              <p className="mt-1 truncate text-xs text-on-surface-variant">
                {activeGoal.title}
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between text-[10px] font-mono uppercase text-on-surface-variant">
                <span>Not available</span>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">
                No progress value is available for the current goal.
              </p>
            </>
          )}
        </AnalyticalCard>

        <AnalyticalCard
          label="Sprint Progress"
          progressLabel={
            activeSprint?.progress != null
              ? `${Math.round(Math.max(0, Math.min(100, activeSprint.progress)))}%`
              : undefined
          }
          progressValue={
            activeSprint?.progress != null
              ? Math.max(0, Math.min(100, activeSprint.progress))
              : null
          }
        >
          {activeSprint?.progress != null ? (
            <>
              <div className="flex justify-between text-[10px] font-mono uppercase text-on-surface-variant">
                <span>Current progress</span>
                <span>{Math.round(Math.max(0, Math.min(100, activeSprint.progress)))}%</span>
              </div>
              <p className="mt-1 truncate text-xs text-on-surface-variant">
                {activeSprint.title}
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between text-[10px] font-mono uppercase text-on-surface-variant">
                <span>Not available</span>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">
                No progress value is available for the current sprint.
              </p>
            </>
          )}
        </AnalyticalCard>

        <AnalyticalCard label="Current Attention">
          <div className="flex items-center justify-between">
            <span className="font-mono text-base font-semibold text-on-surface">
              {risk.label}
            </span>
            <div className="flex flex-col items-end gap-0.5 text-[10px] font-mono uppercase text-on-surface-variant">
              <span>Tasks overdue: {summary.overdueTasks}</span>
              <span>AI pending: {summary.pendingAIRecommendations}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">
            {summary.overdueTasks > 0
              ? "Overdue work requires coach follow-up."
              : summary.pendingAIRecommendations > 0
                ? "AI recommendations await coach review."
                : "No active risk signals at this time."}
          </p>
        </AnalyticalCard>
      </section>
    </div>
  );
}
