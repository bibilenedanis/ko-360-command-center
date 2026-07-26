import type {
  QueryDatabaseResponse,
  GetDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { createNotionClient, isNotionClientError, APIResponseError } from "./client.server";
import { getNotionConfig } from "./config.server";

export interface NotionQueryError {
  ok: false;
  reason: "not_configured" | "api_error" | "empty";
  message: string;
  status?: number;
}

export interface NotionQuerySuccess<T> {
  ok: true;
  data: T;
}

export type NotionQueryOutcome<T> = NotionQuerySuccess<T> | NotionQueryError;

export interface RawNotionPage {
  id: string;
  properties: Record<string, unknown>;
  url?: string;
  createdTime?: string;
  lastEditedTime?: string;
}

const MAX_PAGE_SIZE = 100;

function toRawPages(response: QueryDatabaseResponse): RawNotionPage[] {
  return response.results
    .filter((page): page is Extract<typeof page, { object: "page" }> => page.object === "page")
    .map((page) => ({
      id: page.id,
      properties: page.properties as Record<string, unknown>,
      url: "url" in page ? page.url : undefined,
      createdTime: "created_time" in page ? page.created_time : undefined,
      lastEditedTime: "last_edited_time" in page ? page.last_edited_time : undefined,
    }));
}

function logNotionError(operation: string, error: unknown): NotionQueryError {
  if (isNotionClientError(error) && error instanceof APIResponseError) {
    console.error(`[notion] ${operation} API error: status=${error.status} code=${error.code}`);
    return {
      ok: false,
      reason: "api_error",
      message: `Notion API rejected ${operation}: ${error.code}`,
      status: error.status,
    };
  }
  console.error(`[notion] ${operation} failed:`, error);
  return {
    ok: false,
    reason: "api_error",
    message: `Unexpected error during ${operation}.`,
  };
}

export async function fetchTasks(): Promise<NotionQueryOutcome<RawNotionPage[]>> {
  const clientResult = createNotionClient();
  if (!clientResult.ok) {
    return {
      ok: false,
      reason: "not_configured",
      message: clientResult.message,
    };
  }

  const config = getNotionConfig();
  if (!config.tasksDatabaseId) {
    return {
      ok: false,
      reason: "not_configured",
      message: "NOTION_TASKS_DATABASE_ID is not set.",
    };
  }

  try {
    const response = await clientResult.client.databases.query({
      database_id: config.tasksDatabaseId,
      page_size: MAX_PAGE_SIZE,
    });
    const pages = toRawPages(response);
    if (pages.length === 0) {
      return { ok: false, reason: "empty", message: "Tasks database returned no pages." };
    }
    return { ok: true, data: pages };
  } catch (error) {
    return logNotionError("fetchTasks", error);
  }
}

export async function fetchAIRecommendations(): Promise<NotionQueryOutcome<RawNotionPage[]>> {
  const clientResult = createNotionClient();
  if (!clientResult.ok) {
    return {
      ok: false,
      reason: "not_configured",
      message: clientResult.message,
    };
  }

  const config = getNotionConfig();
  if (!config.aiRecommendationsDatabaseId) {
    return {
      ok: false,
      reason: "not_configured",
      message: "NOTION_AI_RECOMMENDATIONS_DATABASE_ID is not set.",
    };
  }

  try {
    const response = await clientResult.client.databases.query({
      database_id: config.aiRecommendationsDatabaseId,
      page_size: MAX_PAGE_SIZE,
    });
    const pages = toRawPages(response);
    if (pages.length === 0) {
      return { ok: false, reason: "empty", message: "AI recommendations database returned no pages." };
    }
    return { ok: true, data: pages };
  } catch (error) {
    return logNotionError("fetchAIRecommendations", error);
  }
}

export async function fetchDatabaseSchema(
  databaseId: string,
): Promise<NotionQueryOutcome<GetDatabaseResponse>> {
  const clientResult = createNotionClient();
  if (!clientResult.ok) {
    return { ok: false, reason: "not_configured", message: clientResult.message };
  }

  try {
    const schema = await clientResult.client.databases.retrieve({ database_id: databaseId });
    return { ok: true, data: schema };
  } catch (error) {
    return logNotionError("fetchDatabaseSchema", error);
  }
}
