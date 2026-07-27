import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { localizeStatus, formatShortDateTR } from "@/lib/ui/labels";

interface TasksPanelProps {
  items: StudentProfileRecord[];
  overdueCount: number;
}

function isOverdue(item: StudentProfileRecord): boolean {
  if (!item.date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(item.date);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

function isDone(item: StudentProfileRecord): boolean {
  const s = item.status?.toLowerCase() ?? "";
  return ["done", "completed", "tamam", "kapali", "kapalı"].includes(s);
}

export function TasksPanel({ items, overdueCount }: TasksPanelProps) {
  const active = items.filter((i) => !isDone(i));
  const done = items.filter((i) => isDone(i));

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <PanelHeader
        title="Görevler"
        count={items.length}
        badge={
          overdueCount > 0
            ? { label: `${overdueCount} gecikmiş`, tone: "danger" }
            : undefined
        }
      />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {active.map((item) => {
            const overdue = isOverdue(item);
            const dateLabel = item.date ? formatShortDateTR(item.date) : null;
            return (
              <div
                key={item.id}
                className={cn("flex items-center gap-3 px-5 py-3.5", overdue && "bg-destructive/5")}
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
                    {item.title}
                  </p>
                  {(item.detail || dateLabel) && (
                    <p
                      className={cn(
                        "mt-0.5 text-[11px] font-mono",
                        overdue ? "text-destructive" : "text-on-surface-variant",
                      )}
                    >
                      {overdue && dateLabel ? "Gecikmiş • " : ""}
                      {[item.detail, !overdue ? dateLabel : null]
                        .filter(Boolean)
                        .join("  •  ")}
                    </p>
                  )}
                </div>
                {item.status && (
                  <span
                    className={cn(
                      "shrink-0 border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider",
                      overdue
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-outline-variant bg-surface-high text-on-surface",
                    )}
                  >
                    {localizeStatus(item.status)}
                  </span>
                )}
              </div>
            );
          })}
          {done.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 px-5 py-3.5 opacity-50"
            >
              <Icon
                name="check_circle"
                className="shrink-0 text-[18px] text-on-surface-variant"
              />
              <p className="flex-1 text-sm text-on-surface line-through decoration-on-surface-variant/40">
                {item.title}
              </p>
              {item.status && (
                <span className="shrink-0 border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface">
                  {localizeStatus(item.status)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          Bu öğrenci için görev yok.
        </p>
      )}
    </section>
  );
}
