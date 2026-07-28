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
    <div className="h-1.5 w-full bg-surface-high">
      <div
        className="h-full bg-primary"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
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
          Öğrenci Bağlamı
        </h2>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[color:var(--outline-variant)] md:grid-cols-3 md:divide-x md:divide-y-0">
        <ContextBlock
          label="Aktif Hedef"
          icon="flag"
          empty="Aktif hedef bulunmuyor."
          record={activeGoal}
          showProgress
          progressLabel="Hedef İlerlemesi"
          dateLabel="Hedef Tarihi"
        />
        <ContextBlock
          label="Aktif Sprint"
          icon="bolt"
          empty="Aktif sprint bulunmuyor."
          record={activeSprint}
          showProgress
          progressLabel="Sprint İlerlemesi"
          dateLabel="Bitiş"
          detailLabel="Odak"
        />
        <ContextBlock
          label="Son Değerlendirme"
          icon="assignment"
          empty="Son değerlendirme kaydı yok."
          record={recentAssessment}
          dateLabel="Tarih"
          detailLabel="Sonuç"
        />
      </div>
    </section>
  );
}

interface ContextBlockProps {
  label: string;
  icon: string;
  empty: string;
  record: StudentProfileRecord | null;
  showProgress?: boolean;
  progressLabel?: string;
  dateLabel?: string;
  detailLabel?: string;
}

function ContextBlock({
  label,
  icon,
  empty,
  record,
  showProgress,
  progressLabel,
  dateLabel,
  detailLabel,
}: ContextBlockProps) {
  return (
    <div className="p-5">
      <p className="mb-3 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
        <Icon name={icon} className="text-[14px]" />
        {label}
      </p>
      {record ? (
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-snug text-on-surface">
              {record.title}
            </p>
            {record.status && (
              <span
                className={cn(
                  "shrink-0 border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface",
                )}
              >
                {localizeStatus(record.status)}
              </span>
            )}
          </div>

          {showProgress && typeof record.progress === "number" && (
            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                <span>{progressLabel ?? "İlerleme"}</span>
                <span className="tabular-nums text-on-surface">
                  {Math.round(record.progress)}%
                </span>
              </div>
              <ProgressBar value={record.progress} />
            </div>
          )}

          {record.detail && (
            <p className="text-xs text-on-surface-variant">
              <span className="font-mono uppercase tracking-wider">
                {detailLabel ?? "Detay"}:
              </span>{" "}
              <span className="text-on-surface">{record.detail}</span>
            </p>
          )}

          {record.date && (
            <p className="text-xs font-mono text-on-surface-variant">
              {dateLabel ?? "Tarih"}: {formatShortDateTR(record.date)}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">{empty}</p>
      )}
    </div>
  );
}
