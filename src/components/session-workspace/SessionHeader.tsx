import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus, formatShortDateTR } from "@/lib/ui/labels";
import type { SessionWorkspaceSession } from "@/lib/sessions/workspace.server";

interface SessionHeaderProps {
  session: SessionWorkspaceSession;
  studentId: string;
  studentName: string;
  studentEducationLevel: string | null;
  studentAttentionStatus: string | null;
}

function attentionEmphasis(
  s: string | null,
): "critical" | "attention" | "neutral" {
  if (s === "Critical") return "critical";
  if (s === "Attention") return "attention";
  return "neutral";
}

export function SessionHeader({
  session,
  studentId,
  studentName,
  studentEducationLevel,
  studentAttentionStatus,
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

      <div className="flex flex-col gap-4 border border-outline-variant bg-surface-lowest p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
            Görüşme Alanı
          </span>
          <span className="text-on-surface-variant">·</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
            Salt okunur
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-outline-variant bg-surface-high">
              <Icon
                name="forum"
                className="text-[28px] text-on-surface-variant"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-on-surface">
                {session.title}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-on-surface-variant">
                <Link
                  to="/students/$studentId"
                  params={{ studentId }}
                  className="flex items-center gap-1.5 font-medium text-on-surface hover:underline hover:underline-offset-4"
                >
                  <Icon name="person" className="text-[14px]" />
                  {studentName}
                </Link>
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
                    {session.type}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-2">
            {session.status && (
              <span className="bg-primary px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-primary">
                {localizeStatus(session.status) || session.status}
              </span>
            )}
            {session.upcoming && (
              <span className="border border-outline-variant bg-surface-high px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface">
                Yaklaşan
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
                Öğrenci: {localizeStatus(studentAttentionStatus)}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
