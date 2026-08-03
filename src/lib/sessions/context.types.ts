/**
 * SessionContext domain model
 * 
 * Aggregates all data relevant to a coaching session.
 * Used by the Session Intelligence Engine to generate coaching briefings.
 */

export interface SessionContextStudent {
  id: string;
  name: string;
  studentId: string;
  educationLevel: string | null;
  status: string | null;
  attentionStatus: string | null;
  attentionReason: string | null;
}

export interface SessionContextSession {
  id: string;
  title: string;
  date: string | null;
  type: string | null;
  status: string | null;
}

export interface SessionContextSessionNotes {
  winsAndProgress: string;
  challengesAndObstacles: string;
  coreNotes: string;
  commitments: string;
}

export interface SessionContextPreviousSession {
  id: string;
  title: string;
  date: string | null;
  winsAndProgress: string;
  challengesAndObstacles: string;
  coreNotes: string;
  commitments: string;
}

export interface SessionContextGoal {
  id: string;
  title: string;
  type: string | null;
  status: string | null;
  targetDate: string | null;
  progressPercent: number | null;
}

export interface SessionContextGoals {
  active: SessionContextGoal[];
  completed: SessionContextGoal[];
}

export interface SessionContextSprint {
  id: string;
  title: string;
  status: string | null;
  focus: string | null;
  endDate: string | null;
  progressPercent: number | null;
}

export interface SessionContextTask {
  id: string;
  title: string;
  type: string | null;
  status: string | null;
  dueDate: string | null;
  isOverdue: boolean;
}

export interface SessionContextTasks {
  overdue: SessionContextTask[];
  upcoming: SessionContextTask[];
  completed: SessionContextTask[];
}

export interface SessionContextAssessment {
  id: string;
  title: string;
  type: string | null;
  date: string | null;
  score: string | null;
  result: string | null;
}

export interface SessionContextRecommendation {
  id: string;
  title: string;
  risk: string | null;
  reviewStatus: string | null;
  generatedAt: string | null;
}

export interface SessionContextRecommendations {
  pendingHighRisk: SessionContextRecommendation[];
  pendingOther: SessionContextRecommendation[];
  reviewed: SessionContextRecommendation[];
}

export interface SessionContextMetadata {
  sessionId: string;
  studentId: string;
  builtAt: string;
  dataAvailability: {
    student: boolean;
    session: boolean;
    previousSession: boolean;
    goals: boolean;
    sprint: boolean;
    tasks: boolean;
    assessment: boolean;
    recommendations: boolean;
  };
}

export interface SessionContext {
  student: SessionContextStudent;
  session: SessionContextSession;
  sessionNotes: SessionContextSessionNotes;
  previousSession: SessionContextPreviousSession | null;
  goals: SessionContextGoals;
  sprint: SessionContextSprint | null;
  tasks: SessionContextTasks;
  assessment: SessionContextAssessment | null;
  recommendations: SessionContextRecommendations;
  metadata: SessionContextMetadata;
}
