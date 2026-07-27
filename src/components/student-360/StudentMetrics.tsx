import { cn } from "@/lib/utils";

interface StudentMetricsProps {
  summary: {
    openGoals: number;
    activeSprints: number;
    upcomingSessions: number;
    overdueTasks: number;
    pendingAIRecommendations: number;
  };
}

interface MetricConfig {
  key: string;
  label: string;
  value: number;
  emphasis: "danger" | "warning" | "context";
}

export function StudentMetrics({ summary }: StudentMetricsProps) {
  const metrics: MetricConfig[] = [
    { key: "goals", label: "Open Goals", value: summary.openGoals, emphasis: "context" },
    { key: "sprints", label: "Active Sprints", value: summary.activeSprints, emphasis: "context" },
    { key: "sessions", label: "Upcoming Sessions", value: summary.upcomingSessions, emphasis: "context" },
    { key: "overdue", label: "Overdue Tasks", value: summary.overdueTasks, emphasis: "danger" },
    { key: "pendingAI", label: "Pending AI", value: summary.pendingAIRecommendations, emphasis: "warning" },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((metric) => {
        const isDanger = metric.emphasis === "danger" && metric.value > 0;
        const isWarning = metric.emphasis === "warning" && metric.value > 0;
        return (
          <div
            key={metric.key}
            className={cn(
              "flex h-32 flex-col justify-between border bg-surface-lowest p-4",
              isDanger
                ? "border-destructive/50"
                : "border-outline-variant",
            )}
          >
            <span
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.08em]",
                isDanger ? "text-destructive" : "text-on-surface-variant",
              )}
            >
              {metric.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums leading-none",
                  isDanger
                    ? "text-destructive"
                    : isWarning
                      ? "text-on-surface"
                      : "text-on-surface",
                )}
              >
                {metric.value}
              </span>
              {isWarning && (
                <span className="text-[11px] font-mono text-on-surface-variant">
                  review
                </span>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
