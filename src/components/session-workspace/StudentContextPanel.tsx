import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus, formatShortDateTR } from "@/lib/ui/labels";
import type { StudentProfileRecord } from "@/lib/students/profile.server";

interface StudentContextPanelProps {
  activeGoal: StudentProfileRecord | null;
  activeSprint: StudentProfileRecord | null;
  recentAssessment: StudentProfileRecord | null;
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full bg-surface-high">
      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function StudentContextPanel({
  activeGoal,
  activeSprint,
  recentAssessment,
}: StudentContextPanelProps) {
  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          Öğrenci Özeti
        </h2>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* Sprint progress */}
        {activeSprint && typeof activeSprint.progress === "number" ? (
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">Sprint İlerlemesi</span>
              <span className="font-bold tabular-nums text-primary">
                {Math.round(activeSprint.progress)}%
              </span>
            </div>
            <ProgressBar value={activeSprint.progress} />
          </div>
        ) : null}

        {/* Active goal */}
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
            <Icon name="flag" className="text-[14px]" />
            Aktif Hedef
          </p>
          {activeGoal ? (
            <div>
              <p className="text-sm font-medium leading-snug text-on-surface">
                {activeGoal.title}
              </p>
              {typeof activeGoal.progress === "number" && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                    <span>Hedef İlerlemesi</span>
                    <span className="tabular-nums text-on-surface">
                      {Math.round(activeGoal.progress)}%
                    </span>
                  </div>
                  <ProgressBar value={activeGoal.progress} />
                </div>
              )}
              {activeGoal.date && (
                <p className="mt-1.5 text-[11px] font-mono text-on-surface-variant">
                  Hedef Tarihi: {formatShortDateTR(activeGoal.date)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Aktif hedef yok.</p>
          )}
        </div>

        {/* Recent assessment */}
        <div className="border-t border-outline-variant pt-4">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
            <Icon name="assignment" className="text-[14px]" />
            Son Değerlendirme
          </p>
          {recentAssessment ? (
            <div>
              <p className="text-sm font-medium leading-snug text-on-surface">
                {recentAssessment.title}
              </p>
              {recentAssessment.detail && (
                <p className="mt-1 text-xs text-on-surface-variant">
                  Sonuç:{" "}
                  <span className="font-mono font-semibold text-on-surface">
                    {recentAssessment.detail}
                  </span>
                </p>
              )}
              {recentAssessment.date && (
                <p className="mt-0.5 text-[11px] font-mono text-on-surface-variant">
                  {formatShortDateTR(recentAssessment.date)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">
              Son değerlendirme kaydı yok.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
