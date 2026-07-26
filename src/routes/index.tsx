import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { DailyBrief } from "@/components/command-center/DailyBrief";
import { TodaysPriorities } from "@/components/command-center/TodaysPriorities";
import { AttentionNeeded } from "@/components/command-center/AttentionNeeded";
import { QuickSupport } from "@/components/command-center/QuickSupport";
import { FloatingActionButton } from "@/components/command-center/FloatingActionButton";
import {
  attentionItems,
  dailyBrief,
  flaggedStudentsCount,
  quickActions,
  todaysPriorities,
} from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Koç360 — Command Center" },
      {
        name: "description",
        content:
          "Daily coaching command center. AI briefing, today's priorities, and students needing attention.",
      },
      { property: "og:title", content: "Koç360 — Command Center" },
      {
        property: "og:description",
        content: "Daily coaching command center for Koç360 coaches.",
      },
    ],
  }),
  component: CommandCenter,
});

function CommandCenter() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 space-y-6">
          <DailyBrief brief={dailyBrief} />
          <TodaysPriorities items={todaysPriorities} />
        </section>
        <aside className="lg:col-span-4 space-y-6">
          <AttentionNeeded items={attentionItems} totalFlagged={flaggedStudentsCount} />
          <QuickSupport actions={quickActions} />
        </aside>
      </div>
      <FloatingActionButton />
    </AppShell>
  );
}
