import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { PlaceholderPage } from "@/components/app-shell/PlaceholderPage";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — Koç360" },
      { name: "description", content: "Your coaching schedule in Koç360." },
      { property: "og:title", content: "Schedule — Koç360" },
      { property: "og:description", content: "Your coaching schedule in Koç360." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="Schedule" description="Sessions, deadlines, and calendar view coming soon." />
    </AppShell>
  ),
});
