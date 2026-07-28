import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { localizeStatus, formatShortDateTR } from "@/lib/ui/labels";
import type { StudentProfileRecord } from "@/lib/students/profile.server";

interface SessionTasksPanelProps {
  overdue: StudentProfileRecord[];
  upcoming: StudentProfileRecord[];
  other: StudentProfileRecord[];
}

export function SessionTasksPanel({
  overdue,
  upcoming,
  other,
}: SessionTasksPanelProps) {
  const total = overdue.length + upcoming.length + other.length;

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          <span className="inline-block h-2 w-2 bg-primary" />
          Görevler
        </h2>
        <div className="flex items-center gap-2">
          {overdue.length > 0 && (
            <span className="border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-destructive">
              {overdue.length} gecikmiş
            </span>
          )}
          <span className="text-[11px] font-mono tabular-nums text-on-surface-variant">
            {total}
          </span>
        </div>
      </div>

      {total > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {overdue.map((t) => (
            <TaskRow key={t.id} task={t} overdue />
          ))}
          {upcoming.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
          {other.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          Bu öğrenci için açık görev yok.
        </p>
      )}
    </section>
  );
}

function TaskRow({
  task,
  overdue,
}: {
  task: StudentProfileRecord;
  overdue?: boolean;
}) {
  const dateLabel = task.date ? formatShortDateTR(task.date) : null;
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 py-3.5",
        overdue && "bg-destructive/5",
      )}
    >
      <Icon
        name={overdue ? "warning" : "radio_button_unchecked"}
        filled={overdue}
        className={cn(
          "shrink-0 text-[18px]",
          overdue ? "text-destructive" : "text-on-surface-variant",
        )}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            overdue ? "text-destructive" : "text-on-surface",
          )}
        >
          {task.title}
        </p>
        {(task.detail || dateLabel) && (
          <p
            className={cn(
              "mt-0.5 text-[11px] font-mono",
              overdue ? "text-destructive" : "text-on-surface-variant",
            )}
          >
            {overdue && dateLabel ? "Gecikmiş • " : ""}
            {[task.detail, !overdue ? dateLabel : null]
              .filter(Boolean)
              .join("  •  ")}
          </p>
        )}
      </div>
      {task.status && (
        <span
          className={cn(
            "shrink-0 border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider",
            overdue
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-outline-variant bg-surface-high text-on-surface",
          )}
        >
          {localizeStatus(task.status)}
        </span>
      )}
    </div>
  );
}
