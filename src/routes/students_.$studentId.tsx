import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell/AppShell";
import { StudentHeader } from "@/components/student-360/StudentHeader";
import { StudentBrief } from "@/components/student-360/StudentBrief";
import { StudentMetrics } from "@/components/student-360/StudentMetrics";
import { GoalsPanel } from "@/components/student-360/GoalsPanel";
import { SprintPanel } from "@/components/student-360/SprintPanel";
import { TasksPanel } from "@/components/student-360/TasksPanel";
import { SessionsPanel } from "@/components/student-360/SessionsPanel";
import { AssessmentsPanel } from "@/components/student-360/AssessmentsPanel";
import { AIRecommendationsPanel } from "@/components/student-360/AIRecommendationsPanel";
import {
  getStudentProfileData,
  type StudentProfileData,
} from "@/lib/students/profile.server";

export const Route = createFileRoute("/students_/$studentId")({
  loader: async ({ params }) => {
    return await getStudentProfileData(params.studentId);
  },
  head: () => ({
    meta: [
      { title: "Student 360 — Koç360" },
      {
        name: "description",
        content: "Koç360 Student 360 koçluk profili.",
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
        <StudentHeader
          name={student.name}
          studentId={student.studentId}
          educationLevel={student.educationLevel}
          status={student.status}
          attentionStatus={student.attentionStatus}
          attentionReason={student.attentionReason}
        />

        <StudentBrief
          attentionStatus={student.attentionStatus}
          attentionReason={student.attentionReason}
          summary={summary}
          pendingAIRecommendations={data.aiRecommendations}
        />

        <StudentMetrics
          attentionStatus={student.attentionStatus}
          goals={data.goals}
          sprints={data.sprints}
          sessions={data.sessions}
          summary={summary}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <GoalsPanel items={data.goals} />
          <SprintPanel items={data.sprints} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <TasksPanel items={data.tasks} overdueCount={summary.overdueTasks} />
          <SessionsPanel items={data.sessions} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <AssessmentsPanel items={data.assessments} />
          <AIRecommendationsPanel
            items={data.aiRecommendations}
            pendingCount={summary.pendingAIRecommendations}
          />
        </div>
      </div>
    </AppShell>
  );
}
