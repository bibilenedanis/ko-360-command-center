import type { GetDataSourceResponse } from "@notionhq/client/build/src/api-endpoints";
import { createNotionClient, isNotionClientError, APIResponseError } from "./client.server";
import { getNotionConfig } from "./config.server";

export interface NotionQueryError {
  ok: false;
  reason: "not_configured" | "api_error" | "empty";
  message: string;
  status?: number;
}
export interface NotionQuerySuccess<T> { ok: true; data: T }
export type NotionQueryOutcome<T> = NotionQuerySuccess<T> | NotionQueryError;
export interface RawNotionPage {
  id: string;
  properties: Record<string, unknown>;
  url?: string;
  createdTime?: string;
  lastEditedTime?: string;
}

const MAX_PAGE_SIZE = 100;
const dataSourceCache = new Map<string, string>();

function logNotionError(operation: string, error: unknown): NotionQueryError {
  if (isNotionClientError(error) && error instanceof APIResponseError) {
    console.error(`[notion] ${operation} API error: status=${error.status} code=${error.code}`);
    return { ok: false, reason: "api_error", message: `Notion API rejected ${operation}: ${error.code}`, status: error.status };
  }
  console.error(`[notion] ${operation} failed:`, error);
  return { ok: false, reason: "api_error", message: `Unexpected error during ${operation}.` };
}

export async function resolveDataSourceId(databaseId: string): Promise<string> {
  const cached = dataSourceCache.get(databaseId);
  if (cached) return cached;
  const clientResult = createNotionClient();
  if (!clientResult.ok) throw new Error(clientResult.message);
  const database = await clientResult.client.databases.retrieve({ database_id: databaseId });
  const dataSources = "data_sources" in database ? database.data_sources : [];
  const dataSourceId = dataSources?.[0]?.id;
  if (!dataSourceId) throw new Error(`No data source found for Notion database ${databaseId}.`);
  dataSourceCache.set(databaseId, dataSourceId);
  return dataSourceId;
}

export async function fetchDatabasePages(databaseId: string | undefined, label: string): Promise<NotionQueryOutcome<RawNotionPage[]>> {
  if (!databaseId) return { ok: false, reason: "not_configured", message: `${label} database ID is not set.` };
  const clientResult = createNotionClient();
  if (!clientResult.ok) return { ok: false, reason: "not_configured", message: clientResult.message };
  try {
    const dataSourceId = await resolveDataSourceId(databaseId);
    const pages: RawNotionPage[] = [];
    let cursor: string | undefined;
    do {
      const response = await clientResult.client.dataSources.query({
        data_source_id: dataSourceId,
        page_size: MAX_PAGE_SIZE,
        ...(cursor ? { start_cursor: cursor } : {}),
      });
      for (const result of response.results) {
        if (result.object !== "page" || !("properties" in result)) continue;
        pages.push({
          id: result.id,
          properties: result.properties as Record<string, unknown>,
          url: "url" in result ? result.url : undefined,
          createdTime: "created_time" in result ? result.created_time : undefined,
          lastEditedTime: "last_edited_time" in result ? result.last_edited_time : undefined,
        });
      }
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
    if (pages.length === 0) return { ok: false, reason: "empty", message: `${label} database returned no pages.` };
    return { ok: true, data: pages };
  } catch (error) {
    return logNotionError(`fetch${label}`, error);
  }
}

export function fetchStudents() { return fetchDatabasePages(getNotionConfig().studentsDatabaseId, "Students"); }
export function fetchTasks() { return fetchDatabasePages(getNotionConfig().tasksDatabaseId, "Tasks"); }
export function fetchAIRecommendations() { return fetchDatabasePages(getNotionConfig().aiRecommendationsDatabaseId, "AIRecommendations"); }

export async function fetchDatabaseSchema(
  databaseId: string,
): Promise<NotionQueryOutcome<GetDataSourceResponse>> {
  const clientResult = createNotionClient();

  if (!clientResult.ok) {
    return {
      ok: false,
      reason: "not_configured",
      message: clientResult.message,
    };
  }

  try {
    const dataSourceId = await resolveDataSourceId(databaseId);

    const schema = await clientResult.client.dataSources.retrieve({
      data_source_id: dataSourceId,
    });

    return {
      ok: true,
      data: schema,
    };
  } catch (error) {
    return logNotionError("fetchDatabaseSchema", error);
  }
}

export function fetchGoals() {
  return fetchDatabasePages(getNotionConfig().goalsDatabaseId, "Goals");
}

export function fetchSprints() {
  return fetchDatabasePages(getNotionConfig().sprintsDatabaseId, "Sprints");
}

export function fetchSessions() {
  return fetchDatabasePages(getNotionConfig().sessionsDatabaseId, "Sessions");
}

export function fetchAssessments() {
  return fetchDatabasePages(getNotionConfig().assessmentsDatabaseId, "Assessments");
}
