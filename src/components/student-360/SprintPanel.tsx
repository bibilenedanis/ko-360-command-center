import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { PanelHeader } from "./PanelHeader";
import { localizeStatus, formatShortDateTR } from "@/lib/ui/labels";

interface SprintPanelProps {
  items: StudentProfileRecord[];
}

function isActive(status: string | null): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === "active" || s === "in progress" || s === "ongoing";
}

export function SprintPanel({ items }: SprintPanelProps) {
  const active = items.filter((i) => isActive(i.status));
  const rest = items.filter((i) => !isActive(i.status));

  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <PanelHeader title="Sprintler" count={items.length} />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {active.map((item) => (
            <div key={item.id} className="bg-surface-low px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon
                      name="play_arrow"
                      filled
                      className="text-[16px] text-primary"
                    />
                    <p className="font-medium text-on-surface">{item.title}</p>
                  </div>
                  {item.detail && (
                    <p className="mt-1.5 pl-6 text-xs text-on-surface-variant">
                      {item.detail}
                    </p>
                  )}
                </div>
                {item.status && (
                  <span className="shrink-0 bg-primary px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-on-primary">
                    {localizeStatus(item.status)}
                  </span>
                )}
              </div>
              {item.date && (
                <p className="mt-2 pl-6 text-xs font-mono text-on-surface-variant">
                  Bitiş: {formatShortDateTR(item.date)}
                </p>
              )}
            </div>
          ))}
          {rest.map((item) => (
            <div
              key={item.id}
              className={cn("px-5 py-4", active.length > 0 && "opacity-60")}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium text-on-surface">{item.title}</p>
                {item.status && (
                  <span className="shrink-0 border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface">
                    {localizeStatus(item.status)}
                  </span>
                )}
              </div>
              {(item.detail || item.date) && (
                <p className="mt-1.5 text-xs text-on-surface-variant">
                  {[item.detail, item.date].filter(Boolean).join("  •  ")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          Aktif sprint yok
        </p>
      )}
    </section>
  );
}
