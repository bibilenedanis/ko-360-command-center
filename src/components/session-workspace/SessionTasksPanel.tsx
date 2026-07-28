import { cn } from "@/lib/utils";
import { localizeStatus, formatShortDateTR } from "@/lib/ui/labels";
import type { StudentProfileRecord } from "@/lib/students/profile.server";

interface SessionTasksPanelProps {
  overdue: StudentProfileRecord[];
  upcoming: StudentProfileRecord[];
  other: StudentProfileRecord[];
}

function priorityTone(detail: string | null): "high" | "medium" | "low" | "none" {
  const d = (detail ?? "").toLowerCase();
  if (d.includes("high") || d.includes("yüksek") || d === "kr") return "high";
  if (d.includes("medium") || d.includes("orta") || d === "or") return "medium";
  if (d.includes("low") || d.includes("düşük") || d === "ds") return "low";
  return "none";
}

function PriorityBadge({ detail }: { detail: string | null }) {
  const tone = priorityTone(detail);
  const label = detail ? localizeStatus(detail) || detail : "—";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider",
        tone === "high" && "bg-destructive/10 text-destructive",
        tone === "medium" && "bg-primary/10 text-primary",
        tone === "low" && "bg-surface-high text-on-surface-variant",
        tone === "none" && "bg-surface-high text-on-surface-variant",
      )}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-[10px] font-mono text-on-surface-variant">—</span>;
  return (
    <span className="inline-flex shrink-0 items-center rounded bg-surface-high px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
      {localizeStatus(status)}
    </span>
  );
}

function TaskRow({
  task,
  overdue,
}: {
  task: StudentProfileRecord;
  overdue?: boolean;
}) {
  return (
    <tr className={cn("border-b border-outline-variant last:border-0", overdue && "bg-destructive/5")}>
      <td className="py-3 pr-3">
        <p className={cn("text-sm font-medium leading-snug", overdue ? "text-destructive" : "text-on-surface")}>
          {task.title}
        </p>
        {task.date && (
          <p className={cn("mt-0.5 text-[10px] font-mono", overdue ? "text-destructive" : "text-on-surface-variant")}>
            {overdue ? "Gecikmiş • " : "Son Tarih: "}
            {formatShortDateTR(task.date)}
          </p>
        )}
      </td>
      <td className="py-3 pr-3 align-middle">
        <PriorityBadge detail={task.detail} />
      </td>
      <td className="py-3 align-middle">
        <StatusBadge status={task.status} />
      </td>
    </tr>
  );
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
        <div className="px-5 py-4">
          <div className="max-h-[340px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-lowest">
                <tr className="border-b border-outline-variant">
                  <th className="pb-2 pr-3 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                    Görev
                  </th>
                  <th className="pb-2 pr-3 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                    Öncelik
                  </th>
                  <th className="pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
              {overdue.map((t) => (
                <TaskRow key={t.id} task={t} overdue />
              ))}
              {upcoming.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
              {other.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          Bu öğrenci için açık görev yok.
        </p>
      )}
    </section>
  );
}
