import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { PlaceholderPage } from "@/components/app-shell/PlaceholderPage";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Kaynaklar — Koç360" },
      { name: "description", content: "Koçluk kaynakları kütüphanesi." },
      { property: "og:title", content: "Kaynaklar — Koç360" },
      { property: "og:description", content: "Koçluk kaynakları kütüphanesi." },
    ],
  }),
  component: () => (
    <AppShell>
      <PlaceholderPage
        title="Kaynaklar"
        description="Referans materyalleri ve şablonlar burada yer alacak."
      />
    </AppShell>
  ),
});
