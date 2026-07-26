export interface NotionConfig {
  studentsDatabaseId: string | undefined;
  tasksDatabaseId: string | undefined;
  aiRecommendationsDatabaseId: string | undefined;
}

export function getNotionConfig(): NotionConfig {
  return {
    studentsDatabaseId: process.env.NOTION_STUDENTS_DATABASE_ID,
    tasksDatabaseId: process.env.NOTION_TASKS_DATABASE_ID,
    aiRecommendationsDatabaseId: process.env.NOTION_AI_RECOMMENDATIONS_DATABASE_ID,
  };
}

export function isConfigComplete(config: NotionConfig): boolean {
  return Boolean(config.studentsDatabaseId) && Boolean(config.tasksDatabaseId) && Boolean(config.aiRecommendationsDatabaseId);
}
