import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { PlaceholderPage } from "@/components/app-shell/PlaceholderPage";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — Koç360" },
      { name: "description", content: "Manage your students in Koç360." },
      { property: "og:title", content: "Students — Koç360" },
      { property: "og:description", content: "Manage your students in Koç360." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage title="Students" description="Student roster and 360 profiles will live here." />
    </AppShell>
  ),
});
