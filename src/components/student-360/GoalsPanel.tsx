import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { PanelHeader } from "./PanelHeader";

interface GoalsPanelProps {
  items: StudentProfileRecord[];
}

export function GoalsPanel({ items }: GoalsPanelProps) {
  return (
    <section className="overflow-hidden rounded border border-outline-variant bg-surface">
      <PanelHeader title="Goals" subtitle="Current direction" count={items.length} />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium text-on-surface">{item.title}</p>
                {item.status && (
                  <span className="shrink-0 rounded border border-outline-variant bg-surface-high px-2 py-1 text-[10px] font-mono font-semibold text-on-surface">
                    {item.status}
                  </span>
                )}
              </div>
              {(item.detail || item.date) && (
                <p className="mt-2 text-xs text-on-surface-variant">
                  {[item.detail, item.date].filter(Boolean).join(" • ")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          No active goals for this student.
        </p>
      )}
    </section>
  );
}
