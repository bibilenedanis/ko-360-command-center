import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { testNotionConnection, type NotionConnectionReport } from "@/lib/notion/connection.server";

const loadNotionHealth = createServerFn({ method: "GET" }).handler(async () => {
  return await testNotionConnection();
});

export const Route = createFileRoute("/notion-health")({
  loader: async () => {
    return await loadNotionHealth();
  },
  component: NotionHealthPage,
});

function NotionHealthPage() {
  const report = Route.useLoaderData() as NotionConnectionReport;

  const statusColor = (s: string) =>
    s === "connected"
      ? "text-emerald-600"
      : s === "forbidden"
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Notion Connection Status</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Server-side probe of the Notion integration. Token values are never shown.
        </p>
        <div className="border border-outline-variant rounded p-6 space-y-4 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">configured</span>
            <span className={report.configured ? "text-emerald-600" : "text-red-600"}>
              {String(report.configured)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">studentsDatabase</span>
            <span className={statusColor(report.studentsDatabase)}>{report.studentsDatabase}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">tasksDatabase</span>
            <span className={statusColor(report.tasksDatabase)}>{report.tasksDatabase}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">aiRecommendationsDatabase</span>
            <span className={statusColor(report.aiRecommendationsDatabase)}>
              {report.aiRecommendationsDatabase}
            </span>
          </div>
        </div>
        <pre className="mt-6 text-xs text-muted-foreground bg-surface-lowest p-4 rounded overflow-auto">
{JSON.stringify(report, null, 2)}
        </pre>
      </div>
    </div>
  );
}
