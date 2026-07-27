import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { PlaceholderPage } from "@/components/app-shell/PlaceholderPage";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Takvim — Koç360" },
      { name: "description", content: "Koç360 koçluk takviminiz." },
      { property: "og:title", content: "Takvim — Koç360" },
      { property: "og:description", content: "Koç360 koçluk takviminiz." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage
        title="Takvim"
        description="Görüşmeler, son tarihler ve takvim görünümü yakında."
      />
    </AppShell>
  ),
});
