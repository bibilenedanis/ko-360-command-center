import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { fetchStudents, fetchTasks, type RawNotionPage } from "@/lib/notion/queries.server";
import {
  extractCheckbox,
  extractDate,
  extractFormulaString,
  extractNumber,
  extractTitle,
} from "@/lib/notion/transformers";

const TEST_TASK = "[TEST] Today Task";
const TEST_STUDENT = "[TEST] Integration Student";

type DebugRecord = {
  found: boolean;
  id?: string;
  lastEditedTime?: string;
  values?: Record<string, unknown>;
  raw?: Record<string, unknown>;
};

type NotionDebugReport = {
  fetchedAt: string;
  task: DebugRecord;
  student: DebugRecord;
  errors: string[];
};

function findByTitle(pages: RawNotionPage[], property: string, title: string) {
  return pages.find((page) => extractTitle(page.properties, property) === title);
}

const loadNotionDebug = createServerFn({ method: "GET" }).handler(async (): Promise<NotionDebugReport> => {
  const [tasks, students] = await Promise.all([fetchTasks(), fetchStudents()]);
  const errors: string[] = [];

  if (!tasks.ok) errors.push(`Tasks: ${tasks.message}`);
  if (!students.ok) errors.push(`Students: ${students.message}`);

  const task = tasks.ok ? findByTitle(tasks.data, "Task", TEST_TASK) : undefined;
  const student = students.ok ? findByTitle(students.data, "Student", TEST_STUDENT) : undefined;

  return {
    fetchedAt: new Date().toISOString(),
    task: task
      ? {
          found: true,
          id: task.id,
          lastEditedTime: task.lastEditedTime,
          values: {
            title: extractTitle(task.properties, "Task"),
            dueDate: extractDate(task.properties, "Due Date"),
            dueToday: extractCheckbox(task.properties, "Due Today"),
            isOverdue: extractCheckbox(task.properties, "Is Overdue"),
          },
          raw: {
            "Due Date": task.properties["Due Date"],
            "Due Today": task.properties["Due Today"],
            "Is Overdue": task.properties["Is Overdue"],
          },
        }
      : { found: false },
    student: student
      ? {
          found: true,
          id: student.id,
          lastEditedTime: student.lastEditedTime,
          values: {
            title: extractTitle(student.properties, "Student"),
            overdueTasks: extractNumber(student.properties, "Overdue Tasks"),
            attentionStatus: extractFormulaString(student.properties, "Attention Status"),
            attentionReason: extractFormulaString(student.properties, "Attention Reason"),
          },
          raw: {
            "Overdue Tasks": student.properties["Overdue Tasks"],
            "Attention Status": student.properties["Attention Status"],
            "Attention Reason": student.properties["Attention Reason"],
          },
        }
      : { found: false },
    errors,
  };
});

export const Route = createFileRoute("/notion-debug")({
  loader: () => loadNotionDebug(),
  component: NotionDebugPage,
});

function NotionDebugPage() {
  const report = Route.useLoaderData() as NotionDebugReport;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Notion Debug</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Temporary server-side diagnostic. No token or secret values are shown.
        </p>
        <pre className="text-xs bg-surface-lowest border border-outline-variant rounded p-4 overflow-auto whitespace-pre-wrap">
          {JSON.stringify(report, null, 2)}
        </pre>
      </div>
    </div>
  );
}
