import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell/AppShell";
import {
  getStudentProfileData,
  type StudentProfileData,
  type StudentProfileRecord,
} from "@/lib/students/profile.server";

const loadStudentProfile = createServerFn({ method: "GET" })
  .inputValidator((input: { studentId: string }) => input)
  .handler(async ({ data }) => {
    return await getStudentProfileData(data.studentId);
  });

export const Route = createFileRoute("/students/$studentId")({
  loader: async ({ params }) => {
    return await loadStudentProfile({
      data: { studentId: params.studentId },
    });
  },
  head: () => ({
    meta: [
      { title: "Student 360 — Koç360" },
      {
        name: "description",
        content: "Student 360 coaching profile in Koç360.",
      },
    ],
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const data = Route.useLoaderData() as StudentProfileData;
  const { student, summary } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <Link
            to="/students"
            search={{ filter: "all" }}
            className="text-xs font-mono font-semibold text-primary underline underline-offset-4 hover:opacity-70"
          >
            ← Students
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-on-surface-variant">
                Student 360
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-on-surface">
                {student.name}
              </h1>

              <p className="mt-2 text-sm text-on-surface-variant">
                {student.studentId}
                {student.educationLevel
                  ? ` • ${student.educationLevel}`
                  : ""}
                {student.status ? ` • ${student.status}` : ""}
              </p>
            </div>

            {student.attentionStatus && (
              <div className="rounded border border-outline-variant bg-surface-high px-4 py-3 md:max-w-sm">
                <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                  Attention
                </p>
                <p className="mt-1 font-semibold text-on-surface">
                  {student.attentionStatus}
                </p>
                {student.attentionReason && (
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {student.attentionReason}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <SummaryCard label="Open Goals" value={summary.openGoals} />
          <SummaryCard label="Active Sprints" value={summary.activeSprints} />
          <SummaryCard
            label="Upcoming Sessions"
            value={summary.upcomingSessions}
          />
          <SummaryCard label="Overdue Tasks" value={summary.overdueTasks} />
          <SummaryCard
            label="Pending AI"
            value={summary.pendingAIRecommendations}
          />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ProfileSection title="Goals" items={data.goals} />
          <ProfileSection title="Sprints" items={data.sprints} />
          <ProfileSection title="Sessions" items={data.sessions} />
          <ProfileSection title="Assessments" items={data.assessments} />
          <ProfileSection title="Tasks" items={data.tasks} />
          <ProfileSection
            title="AI Recommendations"
            items={data.aiRecommendations}
          />
        </div>
      </div>
    </AppShell>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded border border-outline-variant bg-surface px-4 py-4">
      <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function ProfileSection({
  title,
  items,
}: {
  title: string;
  items: StudentProfileRecord[];
}) {
  return (
    <section className="overflow-hidden rounded border border-outline-variant bg-surface">
      <div className="border-b border-outline-variant bg-surface-high px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold text-on-surface">{title}</h2>
          <span className="text-xs font-mono text-on-surface-variant">
            {items.length}
          </span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="divide-y divide-[color:var(--outline-variant)]">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium text-on-surface">{item.title}</p>

                {item.status && (
                  <span className="shrink-0 rounded border border-outline-variant bg-surface-high px-2 py-1 text-[10px] font-mono font-semibold text-on-surface">
                    {item.status}
                  </span>
                )}
              </div>

              {(item.detail || item.date) && (
                <p className="mt-2 text-xs text-on-surface-variant">
                  {[item.detail, item.date].filter(Boolean).join(" • ")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-on-surface-variant">
            No records for this student.
          </p>
        </div>
      )}
    </section>
  );
}
