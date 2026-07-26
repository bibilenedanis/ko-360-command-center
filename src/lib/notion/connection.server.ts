import { createNotionClient, isNotionClientError, APIResponseError } from "./client.server";
import { getNotionConfig } from "./config.server";

export type DatabaseStatus = "connected" | "disconnected" | "misconfigured" | "forbidden";

export interface NotionConnectionReport {
  configured: boolean;
  tasksDatabase: DatabaseStatus;
  aiRecommendationsDatabase: DatabaseStatus;
}

function emptyReport(): NotionConnectionReport {
  return {
    configured: false,
    tasksDatabase: "misconfigured",
    aiRecommendationsDatabase: "misconfigured",
  };
}

async function probeDatabase(databaseId: string | undefined): Promise<DatabaseStatus> {
  if (!databaseId) return "misconfigured";

  const clientResult = createNotionClient();
  if (!clientResult.ok) return "disconnected";

  try {
    await clientResult.client.databases.retrieve({ database_id: databaseId });
    return "connected";
  } catch (error) {
    if (isNotionClientError(error) && error instanceof APIResponseError) {
      if (error.status === 404) return "disconnected";
      if (error.status === 401 || error.status === 403) return "forbidden";
    }
    console.error("[notion] probeDatabase failed:", error);
    return "disconnected";
  }
}

export async function testNotionConnection(): Promise<NotionConnectionReport> {
  const tokenOk = (() => {
    const token = process.env.NOTION_TOKEN;
    return typeof token === "string" && token.length > 0 && !token.includes("PLACEHOLDER");
  })();

  if (!tokenOk) return emptyReport();

  const config = getNotionConfig();
  const [tasks, aiRecs] = await Promise.all([
    probeDatabase(config.tasksDatabaseId),
    probeDatabase(config.aiRecommendationsDatabaseId),
  ]);

  return { configured: true, tasksDatabase: tasks, aiRecommendationsDatabase: aiRecs };
}
