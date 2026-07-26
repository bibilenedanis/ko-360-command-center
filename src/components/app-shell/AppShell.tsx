import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavigation } from "./TopNavigation";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <TopNavigation />
      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">{children}</div>
      </main>
    </div>
  );
}
