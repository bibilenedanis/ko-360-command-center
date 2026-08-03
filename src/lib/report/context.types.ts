/**
 * ReportContext domain model
 * 
 * This is the aggregated data structure that will be sent to an AI model
 * for report generation. It contains all contextual information needed
 * to produce a comprehensive coaching report.
 * 
 * Provider-independent: Does not reference any specific LLM provider.
 */

// ============================================================================
// Student Context
// ============================================================================

export interface ReportContextStudent {
  id: string;
  name: string;
  studentId: string;
  educationLevel: string | null;
  status: string | null;
  attentionStatus: string | null;
  attentionReason: string | null;
}

// ============================================================================
// Session Context
// ============================================================================

export interface ReportContextSession {
  id: string;
  title: string;
  date: string | null;
  type: string | null;
  status: string | null;
}

// ============================================================================
// Session Notes Context
// ============================================================================

export interface ReportContextSessionNotes {
  winsAndProgress: string;
  challengesAndObstacles: string;
  coreNotes: string;
  commitments: string;
}

// ============================================================================
// Assessment Context
// ============================================================================

export interface ReportContextAssessment {
  id: string;
  title: string;
  type: string | null;
  date: string | null;
  score: string | null;
  result: string | null;
}

// ============================================================================
// Goals Context
// ============================================================================

export interface ReportContextGoal {
  id: string;
  title: string;
  type: string | null;
  status: string | null;
  targetDate: string | null;
  progressPercent: number | null;
}

export interface ReportContextGoals {
  active: ReportContextGoal[];
  completed: ReportContextGoal[];
}

// ============================================================================
// Sprint Context
// ============================================================================

export interface ReportContextSprint {
  id: string;
  title: string;
  status: string | null;
  focus: string | null;
  endDate: string | null;
  progressPercent: number | null;
}

// ============================================================================
// Tasks Context
// ============================================================================

export interface ReportContextTask {
  id: string;
  title: string;
  type: string | null;
  status: string | null;
  dueDate: string | null;
  isOverdue: boolean;
}

export interface ReportContextTasks {
  overdue: ReportContextTask[];
  upcoming: ReportContextTask[];
  completed: ReportContextTask[];
}

// ============================================================================
// AI Recommendations Context
// ============================================================================

export interface ReportContextRecommendation {
  id: string;
  title: string;
  risk: string | null;
  reviewStatus: string | null;
  generatedAt: string | null;
}

export interface ReportContextRecommendations {
  pendingHighRisk: ReportContextRecommendation[];
  pendingOther: ReportContextRecommendation[];
  reviewed: ReportContextRecommendation[];
}

// ============================================================================
// Coach Notes Context
// ============================================================================

/**
 * TODO: Coach Notes are not yet implemented.
 * This is a placeholder for future integration with a Coach Notes database.
 */
export interface ReportContextCoachNotes {
  available: false;
  reason: string;
  notes: null;
}

// ============================================================================
// Parent Feedback Context
// ============================================================================

/**
 * TODO: Parent Feedback is not yet implemented.
 * This is a placeholder for future integration with a Parent Feedback database.
 */
export interface ReportContextParentFeedback {
  available: false;
  reason: string;
  feedback: null;
}

// ============================================================================
// Previous Reports Context
// ============================================================================

/**
 * TODO: Previous Reports are not yet implemented.
 * This is a placeholder for future integration with a Reports database.
 */
export interface ReportContextPreviousReports {
  available: false;
  reason: string;
  reports: null;
}

// ============================================================================
// Metadata Context
// ============================================================================

export interface ReportContextMetadata {
  sessionId: string;
  studentId: string;
  builtAt: string;
  dataAvailability: {
    student: boolean;
    session: boolean;
    sessionNotes: boolean;
    assessment: boolean;
    goals: boolean;
    sprint: boolean;
    tasks: boolean;
    recommendations: boolean;
    coachNotes: boolean;
    parentFeedback: boolean;
    previousReports: boolean;
  };
}

// ============================================================================
// Main ReportContext
// ============================================================================

export interface ReportContext {
  student: ReportContextStudent;
  session: ReportContextSession;
  sessionNotes: ReportContextSessionNotes;
  assessment: ReportContextAssessment | null;
  goals: ReportContextGoals;
  sprint: ReportContextSprint | null;
  tasks: ReportContextTasks;
  recommendations: ReportContextRecommendations;
  coachNotes: ReportContextCoachNotes;
  parentFeedback: ReportContextParentFeedback;
  previousReports: ReportContextPreviousReports;
  metadata: ReportContextMetadata;
}
