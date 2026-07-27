import type { AttentionItem, DailyBrief, PriorityItem, PriorityCategory, AttentionStatus, StudentLevel } from "@/types/koc360";
import type { RawNotionPage } from "./queries.server";

type AnyProperty = { type?: string; [key: string]: any };
function prop(properties: Record<string, unknown>, name: string): AnyProperty | undefined {
  const value = properties[name];
  return value && typeof value === "object" ? value as AnyProperty : undefined;
}
export function extractTitle(p: Record<string, unknown>, n: string): string { return prop(p,n)?.title?.map((x:any)=>x.plain_text).join("").trim() ?? ""; }
export function extractRichText(p: Record<string, unknown>, n: string): string { return prop(p,n)?.rich_text?.map((x:any)=>x.plain_text).join("").trim() ?? ""; }
export function extractSelect(p: Record<string, unknown>, n: string): string | null { return prop(p,n)?.select?.name ?? null; }
export function extractStatus(p: Record<string, unknown>, n: string): string | null { return prop(p,n)?.status?.name ?? null; }
export function extractCheckbox(p: Record<string, unknown>, n: string): boolean { return prop(p,n)?.checkbox ?? prop(p,n)?.formula?.boolean ?? false; }
export function extractNumber(p: Record<string, unknown>, n: string): number | null {
  const v=prop(p,n); return typeof v?.number === "number" ? v.number : typeof v?.formula?.number === "number" ? v.formula.number : typeof v?.rollup?.number === "number" ? v.rollup.number : null;
}
export function extractFormulaString(p: Record<string, unknown>, n: string): string | null { return prop(p,n)?.formula?.string ?? null; }
export function extractDate(p: Record<string, unknown>, n: string): string | null { return prop(p,n)?.date?.start ?? null; }

export function extractRelationIds(
  p: Record<string, unknown>,
  n: string,
): string[] {
  const relation = prop(p, n)?.relation;

  if (!Array.isArray(relation)) return [];

  return relation
    .map((item: any) => item?.id)
    .filter((id: unknown): id is string => typeof id === "string");
}

function priorityCategory(priority: string | null, taskType: string | null): PriorityCategory {
  if (priority === "Critical") return "CRITICAL";
  const value = (taskType ?? "").toLowerCase();
  if (value.includes("feedback")) return "FEEDBACK";
  if (value.includes("report")) return "REPORTING";
  return "ANALYSIS";
}

export function transformTaskToPriority(page: RawNotionPage): PriorityItem {
  const p=page.properties;
  const title=extractTitle(p,"Task") || "Untitled task";
  const priority=extractSelect(p,"Priority");
  const taskType=extractSelect(p,"Task Type");
  const due=extractDate(p,"Due Date");
  const status=extractSelect(p,"Status") ?? extractStatus(p,"Status");
  const parts=[taskType,status,due ? `Due ${due.slice(0,10)}` : null].filter(Boolean);
  return { id: page.id, category: priorityCategory(priority, taskType), title, description: parts.join(" • ") };
}

function attentionStatus(raw: string): AttentionStatus {
  return raw === "Critical" ? "DECLINING" : "DEADLINE";
}
function studentLevel(p: Record<string, unknown>): StudentLevel {
  const level=(extractSelect(p,"Education Level") ?? "").toLowerCase();
  if (level.includes("high") || level.includes("lise")) return "ADV";
  if (level.includes("middle") || level.includes("orta")) return "INT";
  return "BEG";
}
export function transformStudentToAttention(page: RawNotionPage): AttentionItem {
  const p=page.properties;
  return {
    id: page.id,
    name: extractTitle(p,"Student") || "Unknown student",
    status: attentionStatus(extractFormulaString(p,"Attention Status") ?? "Attention"),
    description: extractFormulaString(p,"Attention Reason") ?? "Attention required",
    studentId: extractRichText(p,"Student ID") || "—",
    level: studentLevel(p),
  };
}

export function buildDailyBrief(aiPages: RawNotionPage[], studentPages: RawNotionPage[], taskPages: RawNotionPage[]): DailyBrief {
  const pending=aiPages.filter(p=>extractCheckbox(p.properties,"Pending Flag")).length;
  const highRisk=aiPages.filter(p=>extractCheckbox(p.properties,"High Risk Flag")).length;
  const criticalStudents=studentPages.filter(p=>extractFormulaString(p.properties,"Attention Status") === "Critical").length;
  const dueToday=taskPages.filter(p=>extractCheckbox(p.properties,"Due Today")).length;
  const signals=[] as string[];
  if (criticalStudents) signals.push(`${criticalStudents} critical student${criticalStudents===1?"":"s"}`);
  if (dueToday) signals.push(`${dueToday} task${dueToday===1?"":"s"} due today`);
  if (pending) signals.push(`${pending} AI recommendation${pending===1?"":"s"} awaiting review`);
  if (highRisk) signals.push(`${highRisk} high-risk AI signal${highRisk===1?"":"s"}`);
  return { greeting: "Good morning, Coach.", body: signals.length ? `Today: ${signals.join(" • ")}.` : "No active attention signals are currently recorded in Koç360." };
}

export interface NotionSchemaProperty { name: string; type: string }
export function extractSchemaPropertyNames(schema: { properties: Record<string, unknown> }): NotionSchemaProperty[] {
  return Object.entries(schema.properties).map(([name,value])=>({name,type:(value as {type?:string})?.type ?? "unknown"}));
}

export function transformStudentToListItem(page: RawNotionPage): import("@/types/koc360").StudentListItem {
  const p = page.properties;
  const rawAttentionStatus = extractFormulaString(p, "Attention Status");

  const attentionStatus =
    rawAttentionStatus === "Critical"
      ? "Critical"
      : rawAttentionStatus === "Attention"
        ? "Attention"
        : "On Track";

  return {
    id: page.id,
    name: extractTitle(p, "Student") || "Unknown student",
    studentId: extractRichText(p, "Student ID") || "—",
    educationLevel: extractSelect(p, "Education Level") ?? "—",
    status: extractSelect(p, "Status") ?? extractStatus(p, "Status") ?? "—",
    attentionStatus,
    attentionReason:
      extractFormulaString(p, "Attention Reason") ?? "No active attention signals",
  };
}
