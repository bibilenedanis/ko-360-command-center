export interface NotionConfig {
  studentsDatabaseId: string | undefined;
  tasksDatabaseId: string | undefined;
  goalsDatabaseId: string | undefined;
  sprintsDatabaseId: string | undefined;
  sessionsDatabaseId: string | undefined;
  assessmentsDatabaseId: string | undefined;
  aiRecommendationsDatabaseId: string | undefined;
}

export function getNotionConfig(): NotionConfig {
  return {
    studentsDatabaseId: process.env.NOTION_STUDENTS_DATABASE_ID,
    tasksDatabaseId: process.env.NOTION_TASKS_DATABASE_ID,
    goalsDatabaseId: process.env.NOTION_GOALS_DATABASE_ID,
    sprintsDatabaseId: process.env.NOTION_SPRINTS_DATABASE_ID,
    sessionsDatabaseId: process.env.NOTION_SESSIONS_DATABASE_ID,
    assessmentsDatabaseId: process.env.NOTION_ASSESSMENTS_DATABASE_ID,
    aiRecommendationsDatabaseId: process.env.NOTION_AI_RECOMMENDATIONS_DATABASE_ID,
  };
}

export function isConfigComplete(config: NotionConfig): boolean {
  return Boolean(
    config.studentsDatabaseId &&
    config.tasksDatabaseId &&
    config.goalsDatabaseId &&
    config.sprintsDatabaseId &&
    config.sessionsDatabaseId &&
    config.assessmentsDatabaseId &&
    config.aiRecommendationsDatabaseId
  );
}
