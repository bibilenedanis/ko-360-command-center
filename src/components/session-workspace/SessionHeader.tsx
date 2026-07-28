import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus, localizeSessionType, formatShortDateTR } from "@/lib/ui/labels";
import type { SessionWorkspaceSession } from "@/lib/sessions/workspace.server";

interface SessionHeaderProps {
  session: SessionWorkspaceSession;
  studentId: string;
  studentName: string;
  studentEducationLevel: string | null;
  studentAttentionStatus: string | null;
  openGoalCount: number;
  activeGoalProgress: number | null;
  activeSprintProgress: number | null;
}

function attentionEmphasis(
  s: string | null,
): "critical" | "attention" | "neutral" {
  if (s === "Critical") return "critical";
  if (s === "Attention") return "attention";
  return "neutral";
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full bg-surface-high">
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function SessionHeader({
  session,
  studentId,
  studentName,
  studentEducationLevel,
  studentAttentionStatus,
  openGoalCount,
  activeGoalProgress,
  activeSprintProgress,
}: SessionHeaderProps) {
  const emphasis = attentionEmphasis(studentAttentionStatus);

  return (
    <header>
      <Link
        to="/students/$studentId"
        params={{ studentId }}
        className="mb-3 inline-flex items-center gap-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant transition-opacity hover:opacity-70"
      >
        <Icon name="arrow_back" className="text-[14px]" />
        Öğrenci Profiline Dön
      </Link>

      <div className="border border-outline-variant bg-surface-lowest p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: identity + context */}
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-outline-variant bg-surface-high">
              <Icon name="person" className="text-[28px] text-on-surface-variant" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-on-surface">
                  {studentName}
                </h1>
                {session.status && (
                  <span className="bg-primary px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-primary">
                    {localizeStatus(session.status)}
                  </span>
                )}
                {studentAttentionStatus && emphasis !== "neutral" && (
                  <span
                    className={cn(
                      "border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider",
                      emphasis === "critical"
                        ? "border-destructive/50 bg-destructive/10 text-destructive"
                        : "border-outline-variant bg-surface-high text-on-surface",
                    )}
                  >
                    {localizeStatus(studentAttentionStatus)}
                  </span>
                )}
              </div>
              <p className="text-sm text-on-surface-variant">{session.title}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
                {studentEducationLevel && (
                  <span className="flex items-center gap-1.5">
                    <Icon name="school" className="text-[14px]" />
                    {studentEducationLevel}
                  </span>
                )}
                {session.date && (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Icon name="event" className="text-[14px]" />
                    {formatShortDateTR(session.date)}
                  </span>
                )}
                {session.type && (
                  <span className="flex items-center gap-1.5">
                    <Icon name="category" className="text-[14px]" />
                    {localizeSessionType(session.type)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: KPI strip */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-outline-variant pt-5 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                Açık Hedefler
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums leading-none text-primary">
                {String(openGoalCount).padStart(2, "0")}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                Hedef İlerlemesi
              </p>
              {activeGoalProgress !== null ? (
                <>
                  <p className="mt-1 text-base font-semibold tabular-nums text-on-surface">
                    {Math.round(activeGoalProgress)}%
                  </p>
                  <ProgressBar value={activeGoalProgress} />
                </>
              ) : (
                <p className="mt-1 text-sm text-on-surface-variant">—</p>
              )}
            </div>

            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                Sprint İlerlemesi
              </p>
              {activeSprintProgress !== null ? (
                <>
                  <p className="mt-1 text-base font-semibold tabular-nums text-on-surface">
                    {Math.round(activeSprintProgress)}%
                  </p>
                  <ProgressBar value={activeSprintProgress} />
                </>
              ) : (
                <p className="mt-1 text-sm text-on-surface-variant">—</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
