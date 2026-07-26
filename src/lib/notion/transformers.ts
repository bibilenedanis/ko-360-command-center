import type {
  AttentionItem,
  DailyBrief,
  PriorityItem,
  PriorityCategory,
  AttentionStatus,
  StudentLevel,
} from "@/types/koc360";
import type { RawNotionPage } from "./queries.server";

type PropertyValue =
  | { type: "title"; title: Array<{ plain_text: string }> }
  | { type: "rich_text"; rich_text: Array<{ plain_text: string }> }
  | { type: "select"; select: { name: string } | null }
  | { type: "multi_select"; multi_select: Array<{ name: string }> }
  | { type: "status"; status: { name: string } | null }
  | { type: "people"; people: Array<{ name?: string; id: string }> }
  | { type: "number"; number: number | null }
  | { type: "date"; date: { start: string; end?: string | null } | null }
  | { type: "checkbox"; checkbox: boolean }
  | { type: "url"; url: string | null }
  | { type: "email"; email: string | null }
  | { type: "phone_number"; phone_number: string | null }
  | { type: "formula"; formula: { string?: string; number?: number; boolean?: boolean } }
  | { type: "relation"; relation: Array<{ id: string }> }
  | { type: "rollup"; rollup: { string?: string; number?: number } }
  | { type: "created_time"; created_time: string }
  | { type: "created_by"; created_by: { id: string; name?: string } }
  | { type: "last_edited_time"; last_edited_time: string }
  | { type: "last_edited_by"; last_edited_by: { id: string; name?: string } }
  | { type: "files"; files: Array<{ name: string }> }
  | { type: "unique_id"; unique_id: { number: number; prefix?: string } }
  | { type: "id"; id: string }
  | { type: "verification"; verification: { state: "verified" | "unverified" } };

function getPropertyValue(
  properties: Record<string, unknown>,
  name: string,
): PropertyValue | undefined {
  const raw = properties[name];
  if (!raw || typeof raw !== "object" || !("type" in raw)) {
    return undefined;
  }
  return raw as PropertyValue;
}

export function extractTitle(properties: Record<string, unknown>, name: string): string {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "title") return "";
  return value.title.map((t) => t.plain_text).join("").trim();
}

export function extractRichText(properties: Record<string, unknown>, name: string): string {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "rich_text") return "";
  return value.rich_text.map((t) => t.plain_text).join("").trim();
}

export function extractSelect(properties: Record<string, unknown>, name: string): string | null {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "select") return null;
  return value.select?.name ?? null;
}

export function extractStatus(properties: Record<string, unknown>, name: string): string | null {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "status") return null;
  return value.status?.name ?? null;
}

export function extractMultiSelect(properties: Record<string, unknown>, name: string): string[] {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "multi_select") return [];
  return value.multi_select.map((s) => s.name);
}

export function extractNumber(properties: Record<string, unknown>, name: string): number | null {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "number") return null;
  return value.number;
}

export function extractCheckbox(properties: Record<string, unknown>, name: string): boolean {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "checkbox") return false;
  return value.checkbox;
}

export function extractFormulaString(properties: Record<string, unknown>, name: string): string | null {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "formula") return null;
  return value.formula.string ?? null;
}

export function extractUniqueId(properties: Record<string, unknown>, name: string): string | null {
  const value = getPropertyValue(properties, name);
  if (!value || value.type !== "unique_id") return null;
  return String(value.unique_id.number);
}

const CATEGORY_FIELD_CANDIDATES = ["Category", "Priority", "Type", "Tag", "Kategori"] as const;
const STATUS_FIELD_CANDIDATES = ["Status", "Durum", "State"] as const;
const LEVEL_FIELD_CANDIDATES = ["Level", "Seviye", "Düzey"] as const;
const STUDENT_NAME_FIELD_CANDIDATES = ["Student", "Öğrenci", "Name", "İsim", "Ad"] as const;
const STUDENT_ID_FIELD_CANDIDATES = ["Student ID", "Öğrenci No", "ID", "No"] as const;
const DESCRIPTION_FIELD_CANDIDATES = ["Description", "Açıklama", "Notes", "Notlar", "Detail", "Detay"] as const;

function firstMatching(
  properties: Record<string, unknown>,
  candidates: readonly string[],
): string | undefined {
  return candidates.find((c) => properties[c] != null);
}

function normalizeCategory(raw: string | null): PriorityCategory {
  if (!raw) return "ANALYSIS";
  const upper = raw.toUpperCase();
  if (upper.includes("CRIT") || upper.includes("ACIL") || upper.includes("ACİL")) return "CRITICAL";
  if (upper.includes("ANALY") || upper.includes("INCELE")) return "ANALYSIS";
  if (upper.includes("FEEDBACK") || upper.includes("GERI") || upper.includes("GERİ")) return "FEEDBACK";
  if (upper.includes("REPORT") || upper.includes("RAPOR")) return "REPORTING";
  return "ANALYSIS";
}

function normalizeAttentionStatus(raw: string | null): AttentionStatus {
  if (!raw) return "MISSING DATA";
  const upper = raw.toUpperCase();
  if (upper.includes("DECLIN") || upper.includes("DUSU") || upper.includes("DÜŞÜ")) return "DECLINING";
  if (upper.includes("DEADLINE") || upper.includes("SON") || upper.includes("BITIS") || upper.includes("BİTİŞ")) return "DEADLINE";
  return "MISSING DATA";
}

function normalizeLevel(raw: string | null): StudentLevel {
  if (!raw) return "INT";
  const upper = raw.toUpperCase();
  if (upper.startsWith("BEG") || upper.includes("BASLANG") || upper.includes("BAŞLANG")) return "BEG";
  if (upper.startsWith("ADV") || upper.includes("ILERI") || upper.includes("İLERİ")) return "ADV";
  return "INT";
}

export interface TaskTransformOptions {
  categoryField?: string;
  titleField?: string;
  descriptionField?: string;
}

export function transformTaskToPriority(page: RawNotionPage, options: TaskTransformOptions = {}): PriorityItem {
  const { properties, id } = page;
  const categoryField = options.categoryField ?? firstMatching(properties, CATEGORY_FIELD_CANDIDATES);
  const titleField = options.titleField ?? "Title";
  const descriptionField = options.descriptionField ?? firstMatching(properties, DESCRIPTION_FIELD_CANDIDATES) ?? "Description";

  const title = extractTitle(properties, titleField) || extractRichText(properties, titleField) || "Untitled task";
  const description = descriptionField ? extractRichText(properties, descriptionField) : "";
  const category = normalizeCategory(categoryField ? extractSelect(properties, categoryField) : null);

  return { id, category, title, description };
}

export function transformTaskToAttention(page: RawNotionPage): AttentionItem {
  const { properties, id } = page;
  const studentNameField = firstMatching(properties, STUDENT_NAME_FIELD_CANDIDATES) ?? "Name";
  const studentIdField = firstMatching(properties, STUDENT_ID_FIELD_CANDIDATES);
  const statusField = firstMatching(properties, STATUS_FIELD_CANDIDATES) ?? "Status";
  const levelField = firstMatching(properties, LEVEL_FIELD_CANDIDATES);
  const descriptionField = firstMatching(properties, DESCRIPTION_FIELD_CANDIDATES) ?? "Description";

  const name =
    extractTitle(properties, studentNameField) ||
    extractRichText(properties, studentNameField) ||
    "Unknown student";
  const status = normalizeAttentionStatus(extractStatus(properties, statusField) ?? extractSelect(properties, statusField));
  const description = extractRichText(properties, descriptionField);
  const studentId = studentIdField ? (extractUniqueId(properties, studentIdField) ?? extractRichText(properties, studentIdField) ?? "—") : "—";
  const level = normalizeLevel(levelField ? extractSelect(properties, levelField) : null);

  return { id, name, status, description, studentId, level };
}

export interface AIRecommendationTransformOptions {
  greetingField?: string;
  bodyField?: string;
  highlightField?: string;
}

export function transformAIRecommendationToDailyBrief(
  page: RawNotionPage,
  options: AIRecommendationTransformOptions = {},
): DailyBrief {
  const { properties } = page;
  const greetingField = options.greetingField ?? "Greeting";
  const bodyField = options.bodyField ?? firstMatching(properties, ["Body", "Brief", "Summary", "Özet", "Metin"]) ?? "Body";
  const highlightField = options.highlightField ?? "Highlight";

  const greeting = extractRichText(properties, greetingField) || "Good morning, Coach.";
  const body = extractRichText(properties, bodyField) || "";
  const highlight = extractRichText(properties, highlightField) || undefined;

  return { greeting, body, highlight };
}

export interface NotionSchemaProperty {
  name: string;
  type: string;
}

export function extractSchemaPropertyNames(schema: {
  properties: Record<string, unknown>;
}): NotionSchemaProperty[] {
  return Object.entries(schema.properties).map(([name, value]) => ({
    name,
    type: (value as { type?: string })?.type ?? "unknown",
  }));
}
