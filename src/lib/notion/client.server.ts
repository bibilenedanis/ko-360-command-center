import { Client, APIResponseError, isNotionClientError } from "@notionhq/client";

export interface NotionClientResult {
  ok: true;
  client: Client;
}

export interface NotionClientError {
  ok: false;
  reason: "missing_token" | "not_configured";
  message: string;
}

export type NotionClientOutcome = NotionClientResult | NotionClientError;

export { APIResponseError, isNotionClientError };

export function getNotionToken(): string | undefined {
  return process.env.NOTION_TOKEN;
}

export function isNotionConfigured(): boolean {
  const token = getNotionToken();
  return typeof token === "string" && token.length > 0 && !token.includes("PLACEHOLDER");
}

export function createNotionClient(): NotionClientOutcome {
  const token = getNotionToken();
  if (!token || token.includes("PLACEHOLDER")) {
    return {
      ok: false,
      reason: "missing_token",
      message: "NOTION_TOKEN is not set. Add a valid integration token to .env.",
    };
  }
  return {
    ok: true,
    client: new Client({ auth: token, timeoutMs: 10000 }),
  };
}
