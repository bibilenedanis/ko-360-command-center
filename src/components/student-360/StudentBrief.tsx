import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type AttentionStatus = "Critical" | "Attention" | "On Track" | string | null;

interface StudentBriefProps {
  attentionStatus: AttentionStatus;
  attentionReason: string | null;
  summary: {
    openGoals: number;
    activeSprints: number;
    upcomingSessions: number;
    overdueTasks: number;
    pendingAIRecommendations: number;
  };
  pendingAIRecommendations: StudentProfileRecordLite[];
}

interface StudentProfileRecordLite {
  id: string;
  title: string;
  detail: string | null;
}

function emphasis(status: AttentionStatus): "critical" | "attention" | "neutral" {
  if (status === "Critical") return "critical";
  if (status === "Attention") return "attention";
  return "neutral";
}

function buildDecisionSummary(
  status: AttentionStatus,
  reason: string | null,
  summary: StudentBriefProps["summary"],
): string {
  const signals: string[] = [];

  if (status === "Critical") {
    signals.push("This student requires immediate coaching attention.");
  } else if (status === "Attention") {
    signals.push("This student is showing signals that warrant a closer look.");
  } else if (status === "On Track") {
    signals.push("This student is on track. No intervention needed right now.");
  }

  if (reason && !signals.some((s) => s.includes(reason))) {
    signals.push(reason);
  }

  if (summary.overdueTasks > 0) {
    signals.push(
      `${summary.overdueTasks} overdue ${summary.overdueTasks === 1 ? "task" : "tasks"} need${summary.overdueTasks === 1 ? "s" : ""} follow-up.`,
    );
  }
  if (summary.pendingAIRecommendations > 0) {
    signals.push(
      `${summary.pendingAIRecommendations} AI ${summary.pendingAIRecommendations === 1 ? "recommendation" : "recommendations"} pending review.`,
    );
  }
  if (summary.activeSprints > 0) {
    signals.push(
      `${summary.activeSprints} active ${summary.activeSprints === 1 ? "sprint" : "sprints"} in execution.`,
    );
  }

  return signals.join(" ");
}

export function StudentBrief({
  attentionStatus,
  attentionReason,
  summary,
  pendingAIRecommendations,
}: StudentBriefProps) {
  const level = emphasis(attentionStatus);
  const decisionText = buildDecisionSummary(attentionStatus, attentionReason, summary);
  const topPending = pendingAIRecommendations.slice(0, 1)[0];

  return (
    <section
      className={cn(
        "overflow-hidden rounded border",
        level === "critical"
          ? "border-destructive/40 bg-destructive/5"
          : level === "attention"
            ? "border-outline-variant bg-surface-high"
            : "border-outline-variant bg-surface",
      )}
    >
      <div className="flex items-center gap-2 border-b border-outline-variant px-6 py-4">
        <Icon
          name="auto_awesome"
          filled
          className={cn(
            "text-[18px]",
            level === "critical" ? "text-destructive" : "text-on-surface-variant",
          )}
        />
        <h2 className="text-xs font-mono font-semibold uppercase tracking-widest text-on-surface-variant">
          Coaching Brief
        </h2>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="px-6 py-6 lg:border-r border-outline-variant">
          <p className="text-base font-medium leading-relaxed text-on-surface md:text-lg">
            {decisionText}
          </p>
          {level === "neutral" && (
            <p className="mt-3 text-sm text-on-surface-variant">
              Continue routine monitoring during scheduled sessions.
            </p>
          )}
        </div>

        <div className="px-6 py-6 bg-surface-lowest/50">
          <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
            Next Coach Action
          </p>
          {topPending ? (
            <div className="mt-3 space-y-1">
              <p className="font-medium text-on-surface">{topPending.title}</p>
              {topPending.detail && (
                <p className="text-sm text-on-surface-variant">
                  Risk: {topPending.detail}
                </p>
              )}
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-mono text-on-surface-variant">
                <Icon name="flag" className="text-[14px]" />
                Pending review
              </p>
            </div>
          ) : summary.overdueTasks > 0 ? (
            <p className="mt-3 text-sm text-on-surface">
              Clear {summary.overdueTasks} overdue {summary.overdueTasks === 1 ? "task" : "tasks"} in the Tasks panel.
            </p>
          ) : summary.upcomingSessions > 0 ? (
            <p className="mt-3 text-sm text-on-surface">
              {summary.upcomingSessions} upcoming {summary.upcomingSessions === 1 ? "session" : "sessions"} to prepare for.
            </p>
          ) : (
            <p className="mt-3 text-sm text-on-surface-variant">
              No immediate action flagged for this student.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
