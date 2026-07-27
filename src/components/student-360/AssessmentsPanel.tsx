import type { StudentProfileRecord } from "@/lib/students/profile.server";
import { PanelHeader } from "./PanelHeader";
import { localizeStatus } from "@/lib/ui/labels";

interface AssessmentsPanelProps {
  items: StudentProfileRecord[];
}

export function AssessmentsPanel({ items }: AssessmentsPanelProps) {
  return (
    <section className="border border-outline-variant bg-surface-lowest">
      <PanelHeader title="Değerlendirmeler" count={items.length} />

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium leading-snug text-on-surface">
                  {item.title}
                </p>
                {item.status && (
                  <span className="shrink-0 border border-outline-variant bg-surface-high px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-on-surface">
                    {localizeStatus(item.status)}
                  </span>
                )}
              </div>
              {(item.detail || item.date) && (
                <div className="mt-1.5 flex items-center gap-3 text-xs text-on-surface-variant">
                  {item.detail && (
                    <span className="font-mono font-semibold text-on-surface">
                      {item.detail}
                    </span>
                  )}
                  {item.date && <span>{item.date}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="px-5 py-5 text-sm text-on-surface-variant">
          Kayıtlı değerlendirme yok
        </p>
      )}
    </section>
  );
}
