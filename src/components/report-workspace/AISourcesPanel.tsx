import { Icon } from "@/components/icon";
import type { ReportSource } from "@/lib/report/report.types";

interface AISourcesPanelProps {
  usedSources: ReportSource[];
  missingSources: ReportSource[];
}

export function AISourcesPanel({ usedSources, missingSources }: AISourcesPanelProps) {
  return (
    <div className="bg-surface-container-low border border-outline-variant p-6">
      <h3 className="text-xs font-mono font-bold uppercase text-on-surface-variant mb-4 flex items-center gap-2">
        <Icon name="database" className="text-sm" />
        AI Sources
      </h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase text-on-surface-variant">
            Used Sources
          </p>
          <div className="space-y-1">
            {usedSources.map((source) => (
              <div key={source.id} className="flex items-center gap-2 text-xs">
                <Icon
                  name="check_box"
                  className="text-sm text-primary"
                />
                {source.title}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-mono uppercase text-on-surface-variant">
            Missing Data
          </p>
          <div className="space-y-1">
            {missingSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-2 text-xs text-on-surface-variant"
              >
                <Icon name="check_box_outline_blank" className="text-sm" />
                {source.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
