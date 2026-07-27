import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
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

function formatDay(date: string): string {
  try {
    return new Date(date).toLocaleDateString("en-US", { day: "numeric" });
  } catch {
    return date;
  }
}

function formatMonth(date: string): string {
  try {
    return new Date(date).toLocaleDateString("en-US", { month: "short" });
  } catch {
    return "";
  }
}

export function SessionsPanel({ items }: SessionsPanelProps) {
  const upcoming = items.filter((i) => isUpcoming(i.date));
  const past = items.filter((i) => !isUpcoming(i.date));
  const ordered = [...upcoming, ...past];

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <PanelHeader title="Sessions" count={items.length} />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {ordered.map((item) => {
            const upcomingFlag = isUpcoming(item.date);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 px-5 py-3.5",
                  !upcomingFlag && upcoming.length > 0 && "opacity-60",
                )}
              >
                {item.date ? (
                  <div className="flex w-12 shrink-0 flex-col items-center border border-outline-variant bg-surface-high px-1 py-1">
                    <span className="text-[9px] font-mono uppercase text-on-surface-variant">
                      {formatMonth(item.date)}
                    </span>
                    <span className="text-sm font-bold leading-tight text-on-surface">
                      {formatDay(item.date)}
                    </span>
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-outline-variant bg-surface-high">
                    <Icon
                      name="event"
                      className="text-[18px] text-on-surface-variant"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-on-surface">
                    {item.title}
                  </p>
                  {item.detail && (
                    <p className="mt-0.5 text-[11px] text-on-surface-variant">
                      {item.detail}
                    </p>
                  )}
                </div>
                {upcomingFlag && (
                  <span className="shrink-0 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface">
                    Upcoming
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          No upcoming sessions
        </p>
      )}
    </section>
  );
}
