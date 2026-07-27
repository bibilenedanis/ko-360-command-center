import { cn } from "@/lib/utils";

interface PanelHeaderProps {
  title: string;
  count: number;
  badge?: { label: string; tone: "danger" | "warning" };
}

export function PanelHeader({ title, count, badge }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <span className="inline-block h-2 w-2 bg-primary" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2.5">
        {badge && (
          <span
            className={cn(
              "border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider",
              badge.tone === "danger"
                ? "border-destructive/50 bg-destructive/10 text-destructive"
                : "border-outline-variant bg-surface-high text-on-surface",
            )}
          >
            {badge.label}
          </span>
        )}
        <span className="text-[11px] font-mono tabular-nums text-on-surface-variant">
          {count}
        </span>
      </div>
    </div>
  );
}
