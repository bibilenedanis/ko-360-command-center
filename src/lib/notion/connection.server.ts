import { createNotionClient, isNotionClientError, APIResponseError } from "./client.server";
import { getNotionConfig } from "./config.server";

export type DatabaseStatus =
  | "connected"
  | "disconnected"
  | "misconfigured"
  | "forbidden";

export interface NotionConnectionReport {
  configured: boolean;
  studentsDatabase: DatabaseStatus;
  tasksDatabase: DatabaseStatus;
  goalsDatabase: DatabaseStatus;
  sprintsDatabase: DatabaseStatus;
  sessionsDatabase: DatabaseStatus;
  assessmentsDatabase: DatabaseStatus;
  aiRecommendationsDatabase: DatabaseStatus;
}

function emptyReport(): NotionConnectionReport {
  return {
    configured: false,
    studentsDatabase: "misconfigured",
    tasksDatabase: "misconfigured",
    goalsDatabase: "misconfigured",
    sprintsDatabase: "misconfigured",
    sessionsDatabase: "misconfigured",
    assessmentsDatabase: "misconfigured",
    aiRecommendationsDatabase: "misconfigured",
  };
}

async function probeDatabase(
  databaseId: string | undefined,
): Promise<DatabaseStatus> {
  if (!databaseId) return "misconfigured";

  const client = createNotionClient();
  if (!client.ok) return "disconnected";

  try {
    const db = await client.client.databases.retrieve({
      database_id: databaseId,
    });

    const dataSourceId =
      "data_sources" in db ? db.data_sources?.[0]?.id : undefined;

    if (!dataSourceId) return "disconnected";

    await client.client.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 1,
    });

    return "connected";
  } catch (error) {
    if (isNotionClientError(error) && error instanceof APIResponseError) {
      if (error.status === 401 || error.status === 403) {
        return "forbidden";
      }
    }

    console.error("[notion] probeDatabase failed:", error);
    return "disconnected";
  }
}

export async function testNotionConnection(): Promise<NotionConnectionReport> {
  const token = process.env.NOTION_TOKEN;

  if (
    !(
      typeof token === "string" &&
      token.length > 0 &&
      !token.includes("PLACEHOLDER")
    )
  ) {
    return emptyReport();
  }

  const cfg = getNotionConfig();

  const [
    students,
    tasks,
    goals,
    sprints,
    sessions,
    assessments,
    aiRecommendations,
  ] = await Promise.all([
    probeDatabase(cfg.studentsDatabaseId),
    probeDatabase(cfg.tasksDatabaseId),
    probeDatabase(cfg.goalsDatabaseId),
    probeDatabase(cfg.sprintsDatabaseId),
    probeDatabase(cfg.sessionsDatabaseId),
    probeDatabase(cfg.assessmentsDatabaseId),
    probeDatabase(cfg.aiRecommendationsDatabaseId),
  ]);

  return {
    configured: true,
    studentsDatabase: students,
    tasksDatabase: tasks,
    goalsDatabase: goals,
    sprintsDatabase: sprints,
    sessionsDatabase: sessions,
    assessmentsDatabase: assessments,
    aiRecommendationsDatabase: aiRecommendations,
  };
}
