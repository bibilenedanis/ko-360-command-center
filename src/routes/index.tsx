import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell/AppShell";
import { DailyBrief } from "@/components/command-center/DailyBrief";
import { TodaysPriorities } from "@/components/command-center/TodaysPriorities";
import { AttentionNeeded } from "@/components/command-center/AttentionNeeded";
import { QuickSupport } from "@/components/command-center/QuickSupport";
import { FloatingActionButton } from "@/components/command-center/FloatingActionButton";
import { getCommandCenterData, type CommandCenterData } from "@/lib/command-center/data.server";

const loadCommandCenterData = createServerFn({ method: "GET" }).handler(async () => {
  return await getCommandCenterData();
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Koç360 — Kontrol Merkezi" },
      {
        name: "description",
        content:
          "Günlük koçluk kontrol merkezi. AI özeti, bugünün öncelikleri ve dikkat gereken öğrenciler.",
      },
      { property: "og:title", content: "Koç360 — Kontrol Merkezi" },
      {
        property: "og:description",
        content: "Koç360 koçları için günlük koçluk kontrol merkezi.",
      },
    ],
  }),
  loader: async () => {
    return await loadCommandCenterData();
  },
  component: CommandCenter,
});

function CommandCenter() {
  const data = Route.useLoaderData() as CommandCenterData;

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 space-y-6">
          <DailyBrief brief={data.dailyBrief} />
          <TodaysPriorities items={data.todaysPriorities} />
        </section>
        <aside className="lg:col-span-4 space-y-6">
          <AttentionNeeded items={data.attentionItems} totalFlagged={data.flaggedStudentsCount} />
          <QuickSupport actions={data.quickActions} />
        </aside>
      </div>
      <FloatingActionButton />
    </AppShell>
  );
}
