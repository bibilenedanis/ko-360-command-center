import type { ReactNode } from "react";
import { TopNavigation } from "@/components/app-shell/TopNavigation";
import { ReportSidebar } from "./ReportSidebar";
import type { ReportStatus } from "@/lib/report/report.types";

interface ReportShellProps {
  children: ReactNode;
  reportStatus?: ReportStatus;
}

export function ReportShell({ children, reportStatus }: ReportShellProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopNavigation />
      <ReportSidebar reportStatus={reportStatus} />
      <main className="md:ml-64 pt-16 pb-24 min-h-screen">
        {children}
      </main>
    </div>
  );
}
