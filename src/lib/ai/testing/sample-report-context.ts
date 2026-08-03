import type { ReportContext } from "@/lib/report/context.types";

export function createSampleReportContext(): ReportContext {
  return {
    student: {
      id: "student-001",
      name: "Ali Yilmaz",
      studentId: "STU-2024-001",
      educationLevel: "High School",
      status: "Active",
      attentionStatus: "On Track",
      attentionReason: null,
    },
    session: {
      id: "session-001",
      title: "Session 12 - Sprint Review",
      date: "2024-10-24",
      type: "coaching",
      status: "completed",
    },
    sessionNotes: {
      winsAndProgress:
        "Ali showed significant improvement in time management this sprint. He completed 80% of his tasks on time, up from 60% last sprint. He also demonstrated strong problem-solving skills during the physics project.",
      challengesAndObstacles:
        "Morning fatigue continues to affect his first sessions. He struggles with exam anxiety, particularly in math. Procrastination on long-term projects remains an area for growth.",
      coreNotes:
        "Ali responded well to the structured approach we tried this sprint. He seems to thrive when tasks are broken into smaller, manageable chunks. He expressed interest in trying the Pomodoro technique.",
      commitments:
        "- Try Pomodoro technique for homework sessions\n- Review math notes before each class\n- Set a consistent wake-up time for morning sessions",
    },
    assessment: {
      id: "assessment-001",
      title: "Mid-term Math Assessment",
      type: "academic",
      date: "2024-10-15",
      score: "78",
      result: "Proficient",
    },
    goals: {
      active: [
        {
          id: "goal-001",
          title: "Improve Math Grades",
          type: "academic",
          status: "in-progress",
          targetDate: "2024-12-31",
          progressPercent: 65,
        },
        {
          id: "goal-002",
          title: "Develop Time Management Skills",
          type: "personal",
          status: "in-progress",
          targetDate: "2024-11-30",
          progressPercent: 45,
        },
      ],
      completed: [
        {
          id: "goal-003",
          title: "Complete Physics Lab Report",
          type: "academic",
          status: "completed",
          targetDate: "2024-10-20",
          progressPercent: 100,
        },
      ],
    },
    sprint: {
      id: "sprint-012",
      title: "Sprint 12",
      status: "active",
      focus: "Academic Resilience & Time Management",
      endDate: "2024-11-07",
      progressPercent: 60,
    },
    tasks: {
      overdue: [
        {
          id: "task-001",
          title: "Submit history essay draft",
          type: "academic",
          status: "pending",
          dueDate: "2024-10-22",
          isOverdue: true,
        },
      ],
      upcoming: [
        {
          id: "task-002",
          title: "Math exam preparation",
          type: "academic",
          status: "pending",
          dueDate: "2024-10-28",
          isOverdue: false,
        },
        {
          id: "task-003",
          title: "Physics project presentation",
          type: "academic",
          status: "pending",
          dueDate: "2024-11-01",
          isOverdue: false,
        },
      ],
      completed: [
        {
          id: "task-004",
          title: "Physics lab report",
          type: "academic",
          status: "completed",
          dueDate: "2024-10-20",
          isOverdue: false,
        },
      ],
    },
    recommendations: {
      pendingHighRisk: [],
      pendingOther: [
        {
          id: "rec-001",
          title: "Schedule parent-teacher meeting",
          risk: "medium",
          reviewStatus: "pending",
          generatedAt: "2024-10-20",
        },
      ],
      reviewed: [],
    },
    coachNotes: {
      available: false,
      reason: "Coach notes database not yet implemented",
      notes: null,
    },
    parentFeedback: {
      available: false,
      reason: "Parent feedback database not yet implemented",
      feedback: null,
    },
    previousReports: {
      available: false,
      reason: "Previous reports database not yet implemented",
      reports: null,
    },
    metadata: {
      sessionId: "session-001",
      studentId: "student-001",
      builtAt: "2024-10-24T12:00:00.000Z",
      dataAvailability: {
        student: true,
        session: true,
        sessionNotes: true,
        assessment: true,
        goals: true,
        sprint: true,
        tasks: true,
        recommendations: true,
        coachNotes: false,
        parentFeedback: false,
        previousReports: false,
      },
    },
  };
}
