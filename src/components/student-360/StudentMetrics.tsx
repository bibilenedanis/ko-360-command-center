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
  emphasis: "danger" | "warning" | "active" | "context";
}

function metricTone(emphasis: MetricConfig["emphasis"], value: number) {
  if (emphasis === "danger" && value > 0) {
    return {
      card: "border-destructive/50 bg-destructive/5",
      value: "text-destructive",
      label: "text-destructive",
    };
  }
  if (emphasis === "warning" && value > 0) {
    return {
      card: "border-outline-variant bg-surface-high",
      value: "text-on-surface",
      label: "text-on-surface-variant",
    };
  }
  if (emphasis === "active" && value > 0) {
    return {
      card: "border-outline-variant bg-surface",
      value: "text-on-surface",
      label: "text-on-surface-variant",
    };
  }
  return {
    card: "border-outline-variant bg-surface",
    value: "text-on-surface",
    label: "text-on-surface-variant",
  };
}

export function StudentMetrics({ summary }: StudentMetricsProps) {
  const metrics: MetricConfig[] = [
    { key: "overdue", label: "Overdue Tasks", value: summary.overdueTasks, emphasis: "danger" },
    { key: "pendingAI", label: "Pending AI", value: summary.pendingAIRecommendations, emphasis: "warning" },
    { key: "sprints", label: "Active Sprints", value: summary.activeSprints, emphasis: "active" },
    { key: "sessions", label: "Upcoming Sessions", value: summary.upcomingSessions, emphasis: "active" },
    { key: "goals", label: "Open Goals", value: summary.openGoals, emphasis: "context" },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {metrics.map((metric) => {
        const tone = metricTone(metric.emphasis, metric.value);
        return (
          <div
            key={metric.key}
            className={cn("rounded border px-4 py-4 transition-colors", tone.card)}
          >
            <p className={cn("text-[10px] font-mono uppercase tracking-wider", tone.label)}>
              {metric.label}
            </p>
            <p className={cn("mt-2 text-2xl font-semibold tabular-nums", tone.value)}>
              {metric.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
