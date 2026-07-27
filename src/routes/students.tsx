import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell/AppShell";
import { getStudentsData, type StudentsData } from "@/lib/students/data.server";
import type { StudentAttentionStatus, StudentListItem } from "@/types/koc360";
import { localizeStatus, localizeSignalText } from "@/lib/ui/labels";

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
      { title: "Öğrenciler — Koç360" },
      { name: "description", content: "Koç360'ta öğrencilerinizi yönetin." },
      { property: "og:title", content: "Öğrenciler — Koç360" },
      {
        property: "og:description",
        content: "Koç360'ta öğrenci listesi ve dikkat durumu genel görünümü.",
      },
    ],
  }),

  loader: async () => {
    return await loadStudents();
  },

  component: StudentsPage,
});

function StudentsPage() {
  const data = Route.useLoaderData() as StudentsData;
  const { filter } = Route.useSearch();

  const students = data.students.filter((student: StudentListItem) => {
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
      (student: StudentListItem) =>
        student.status === "Active" &&
        student.attentionStatus === "Critical",
    ).length,
    attention: data.students.filter(
      (student: StudentListItem) =>
        student.status === "Active" &&
        (student.attentionStatus === "Critical" ||
          student.attentionStatus === "Attention"),
    ).length,
    onTrack: data.students.filter(
      (student: StudentListItem) =>
        student.status === "Active" &&
        student.attentionStatus === "On Track",
    ).length,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-on-surface-variant">
            Öğrenci Yönetimi
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-on-surface">
            Öğrenciler
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Koç360'tan güncel öğrenci listesi ve dikkat durumu.
          </p>
        </header>

        <nav className="flex flex-wrap gap-2">
          <FilterLink filter="all" active={filter === "all"}>
            Tüm Öğrenciler ({counts.all})
          </FilterLink>

          <FilterLink filter="critical" active={filter === "critical"}>
            Kritik ({counts.critical})
          </FilterLink>

          <FilterLink filter="attention" active={filter === "attention"}>
            Dikkat Gerekiyor ({counts.attention})
          </FilterLink>

          <FilterLink filter="on-track" active={filter === "on-track"}>
            Yolunda ({counts.onTrack})
          </FilterLink>
        </nav>

        <section className="bg-surface border border-outline-variant rounded overflow-hidden">
          {students.length > 0 ? (
            <div className="divide-y divide-[color:var(--outline-variant)]">
              {students.map((student: StudentListItem) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-on-surface-variant">
                Bu filtreye uyan öğrenci yok.
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
        <Link
          to="/students/$studentId"
          params={{ studentId: student.id }}
          className="block truncate font-semibold text-on-surface hover:text-primary hover:underline hover:underline-offset-4"
        >
          {student.name}
        </Link>
        <p className="mt-1 text-xs font-mono text-on-surface-variant">
          {student.studentId}
          {student.educationLevel !== "—"
            ? ` • ${student.educationLevel}`
            : ""}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Durum
        </p>
        <p className="mt-1 text-sm text-on-surface">{localizeStatus(student.status) || student.status}</p>
      </div>

      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Dikkat
        </p>
        <AttentionBadge status={student.attentionStatus} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
          Neden
        </p>
        <p className="mt-1 text-sm text-on-surface-variant">
          {localizeSignalText(student.attentionReason) || student.attentionReason}
        </p>
      </div>
    </div>
  );
}

function AttentionBadge({ status }: { status: StudentAttentionStatus }) {
  return (
    <span className="mt-1 inline-flex rounded border border-outline-variant bg-surface-high px-2 py-1 text-xs font-mono font-semibold text-on-surface">
      {localizeStatus(status)}
    </span>
  );
}
