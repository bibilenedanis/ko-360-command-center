import { cn } from "@/lib/utils";

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  count: number;
  badge?: { label: string; tone: "danger" | "warning" };
}

export function PanelHeader({ title, subtitle, count, badge }: PanelHeaderProps) {
  return (
    <div className="border-b border-outline-variant bg-surface-high px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-on-surface">{title}</h2>
          {subtitle && (
            <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={cn(
                "rounded border px-2 py-0.5 text-[10px] font-mono font-semibold",
                badge.tone === "danger"
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-outline-variant bg-surface px-2 py-0.5 text-[10px] font-mono font-semibold text-on-surface",
              )}
            >
              {badge.label}
            </span>
          )}
          <span className="text-xs font-mono tabular-nums text-on-surface-variant">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
