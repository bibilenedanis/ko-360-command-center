export interface NotionConfig {
  tasksDatabaseId: string | undefined;
  aiRecommendationsDatabaseId: string | undefined;
}

export function getNotionConfig(): NotionConfig {
  return {
    tasksDatabaseId: process.env.NOTION_TASKS_DATABASE_ID,
    aiRecommendationsDatabaseId: process.env.NOTION_AI_RECOMMENDATIONS_DATABASE_ID,
  };
}

export function isConfigComplete(config: NotionConfig): boolean {
  return Boolean(config.tasksDatabaseId) && Boolean(config.aiRecommendationsDatabaseId);
}
