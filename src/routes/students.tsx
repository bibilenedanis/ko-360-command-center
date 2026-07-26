import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell/AppShell";
import { getStudentsData } from "@/lib/students/data.server";
import type { StudentAttentionStatus, StudentListItem } from "@/types/koc360";

type StudentFilter = "all" | "critical" | "attention" | "on-track";

const loadStudents = createServerFn({ method: "GET" }).handler(async () => {
  return await getStudentsData();
});

export const Route = createFileRoute("/students")({
  validateSearch: (search: Record<string, unknown>): { filter: StudentFilter } => {
    const filter = search.filter;

    if (
      filter === "critical" ||
      filter === "attention" ||
      filter === "on-track"
    ) {
      return { filter };
    }

    return { filter: "all" };
  },

  head: () => ({
    meta: [
      { title: "Students — Koç360" },
      { name: "description", content: "Manage your students in Koç360." },
      { property: "og:title", content: "Students — Koç360" },
      {
        property: "og:description",
        content: "Student roster and attention overview in Koç360.",
      },
    ],
  }),

  loader: async () => {
    return await loadStudents();
  },

  component: StudentsPage,
});

function StudentsPage() {
  const data = Route.useLoaderData();
  const { filter } = Route.useSearch();

  const students = data.students.filter((student) => {
    if (filter === "critical") {
      return student.status === "Active" && student.attentionStatus === "Critical";
    }

    if (filter === "attention") {
      return (
        student.status === "Active" &&
        (student.attentionStatus === "Critical" ||
          student.attentionStatus === "Attention")
      );
    }

    if (filter === "on-track") {
      return student.status === "Active" && student.attentionStatus === "On Track";
    }

    return true;
  });

  const counts = {
    all: data.students.length,
    critical: data.students.filter(
      (student) =>
        student.status === "Active" &&
        student.attentionStatus === "Critical",
    ).length,
    attention: data.students.filter(
      (student) =>
        student.status === "Active" &&
        (student.attentionStatus === "Critical" ||
          student.attentionStatus === "Attention"),
    ).length,
    onTrack: data.students.filter(
      (student) =>
        student.status === "Active" &&
        student.attentionStatus === "On Track",
    ).length,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-on-surface-variant">
            Student Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-on-surface">
            Students
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Student roster and current attention status from Koç360.
          </p>
        </header>

        <nav className="flex flex-wrap gap-2">
          <FilterLink filter="all" active={filter === "all"}>
            All Students ({counts.all})
          </FilterLink>

          <FilterLink filter="critical" active={filter === "critical"}>
            Critical ({counts.critical})
          </FilterLink>

          <FilterLink filter="attention" active={filter === "attention"}>
            Needs Attention ({counts.attention})
          </FilterLink>

          <FilterLink filter="on-track" active={filter === "on-track"}>
            On Track ({counts.onTrack})
          </FilterLink>
        </nav>

        <section className="bg-surface border border-outline-variant rounded overflow-hidden">
          {students.length > 0 ? (
            <div className="divide-y divide-[color:var(--outline-variant)]">
              {students.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-on-surface-variant">
                No students match this filter.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function FilterLink({
  filter,
  active,
  children,
}: {
  filter: StudentFilter;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to="/students"
      search={{ filter }}
      className={[
        "rounded border px-4 py-2 text-xs font-mono font-semibold tracking-wide transition-opacity",
        active
          ? "border-primary bg-primary text-on-primary"
          : "border-outline-variant bg-surface text-on-surface hover:opacity-70",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function StudentRow({ student }: { student: StudentListItem }) {
  return (
    <div className="grid gap-4 px-6 py-5 md:grid-cols-[minmax(0,1.5fr)_minmax(120px,0.7fr)_minmax(130px,0.7fr)_minmax(0,2fr)] md:items-center">
      <div className="min-w-0">
        <p className="truncate font-semibold text-on-surface">
          {student.name}
        </p>
        <p className="mt-1 text-xs font-mono text-on-surface-variant">
          {student.studentId}
          {student.educationLevel !== "—"
            ? ` • ${student.educationLevel}`
            : ""}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Status
        </p>
        <p className="mt-1 text-sm text-on-surface">{student.status}</p>
      </div>

      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Attention
        </p>
        <AttentionBadge status={student.attentionStatus} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Reason
        </p>
        <p className="mt-1 text-sm text-on-surface-variant">
          {student.attentionReason}
        </p>
      </div>
    </div>
  );
}

function AttentionBadge({ status }: { status: StudentAttentionStatus }) {
  return (
    <span className="mt-1 inline-flex rounded border border-outline-variant bg-surface-high px-2 py-1 text-xs font-mono font-semibold text-on-surface">
      {status}
    </span>
  );
}
