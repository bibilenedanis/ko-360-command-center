import type { ReactNode } from "react";
import { TopNavigation } from "@/components/app-shell/TopNavigation";
import { ReportSidebar } from "./ReportSidebar";

interface ReportShellProps {
  children: ReactNode;
}

export function ReportShell({ children }: ReportShellProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopNavigation />
      <ReportSidebar />
      <main className="md:ml-64 pt-16 pb-24 min-h-screen">
        {children}
      </main>
    </div>
  );
}
