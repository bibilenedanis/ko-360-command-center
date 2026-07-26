import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { PlaceholderPage } from "@/components/app-shell/PlaceholderPage";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Koç360" },
      { name: "description", content: "Coaching resources library." },
      { property: "og:title", content: "Resources — Koç360" },
      { property: "og:description", content: "Coaching resources library." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="Resources" description="Reference materials and templates will appear here." />
    </AppShell>
  ),
});
