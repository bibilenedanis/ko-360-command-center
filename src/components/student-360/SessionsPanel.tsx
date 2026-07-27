import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { Icon } from "@/components/icon";
import { PanelHeader } from "./PanelHeader";

interface SessionsPanelProps {
  items: StudentProfileRecord[];
}

function isUpcoming(date: string | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) >= today;
}

function formatSessionDate(date: string | null): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export function SessionsPanel({ items }: SessionsPanelProps) {
  const upcoming = items.filter((i) => isUpcoming(i.date));
  const past = items.filter((i) => !isUpcoming(i.date));
  const ordered = [...upcoming, ...past];

  return (
    <section className="overflow-hidden rounded border border-outline-variant bg-surface">
      <PanelHeader title="Sessions" subtitle="Execution" count={items.length} />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {ordered.map((item) => {
            const upcoming = isUpcoming(item.date);
            return (
              <div key={item.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    {item.date && (
                      <div className="shrink-0 rounded border border-outline-variant bg-surface-high px-2 py-1 text-center">
                        <p className="text-[10px] font-mono uppercase text-on-surface-variant">
                          {formatSessionDate(item.date).split(" ")[0]}
                        </p>
                        <p className="text-sm font-semibold text-on-surface">
                          {formatSessionDate(item.date).split(" ")[2] ?? ""}
                        </p>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-on-surface">{item.title}</p>
                      {item.detail && (
                        <p className="mt-1 text-xs text-on-surface-variant">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </div>
                  {upcoming && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-on-surface-variant">
                      <Icon name="schedule" className="text-[14px]" />
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          No sessions scheduled.
        </p>
      )}
    </section>
  );
}
