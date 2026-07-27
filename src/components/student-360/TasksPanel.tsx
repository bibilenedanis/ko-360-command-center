import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";

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
    <section className="overflow-hidden rounded border border-outline-variant bg-surface">
      <PanelHeader
        title="Tasks"
        subtitle="Execution"
        count={items.length}
        badge={
          overdueCount > 0
            ? { label: `${overdueCount} overdue`, tone: "danger" }
            : undefined
        }
      />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {active.map((item) => {
            const overdue = isOverdue(item);
            return (
              <div
                key={item.id}
                className={cn("px-5 py-4", overdue && "bg-destructive/5")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-2">
                    <Icon
                      name={overdue ? "warning" : "radio_button_unchecked"}
                      filled={overdue}
                      className={cn(
                        "mt-0.5 text-[16px]",
                        overdue ? "text-destructive" : "text-on-surface-variant",
                      )}
                    />
                    <p
                      className={cn(
                        "font-medium",
                        overdue ? "text-destructive" : "text-on-surface",
                      )}
                    >
                      {item.title}
                    </p>
                  </div>
                  {item.status && (
                    <span
                      className={cn(
                        "shrink-0 rounded border px-2 py-1 text-[10px] font-mono font-semibold",
                        overdue
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : "border-outline-variant bg-surface-high text-on-surface",
                      )}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
                {(item.detail || item.date) && (
                  <p
                    className={cn(
                      "mt-2 pl-6 text-xs font-mono",
                      overdue ? "text-destructive" : "text-on-surface-variant",
                    )}
                  >
                    {overdue && item.date ? "Overdue • " : ""}
                    {[item.detail, item.date && !overdue ? item.date : null]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}
              </div>
            );
          })}
          {done.map((item) => (
            <div key={item.id} className="px-5 py-4 opacity-60">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-2">
                  <Icon
                    name="check_circle"
                    className="mt-0.5 text-[16px] text-on-surface-variant"
                  />
                  <p className="font-medium text-on-surface line-through decoration-on-surface-variant/40">
                    {item.title}
                  </p>
                </div>
                {item.status && (
                  <span className="shrink-0 rounded border border-outline-variant bg-surface-high px-2 py-1 text-[10px] font-mono font-semibold text-on-surface">
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          No tasks for this student.
        </p>
      )}
    </section>
  );
}
