import type { AttentionItem, DailyBrief, PriorityItem, QuickAction } from "@/types/koc360";
import {
  quickActions as mockQuickActions,
  flaggedStudentsCount as mockFlaggedStudentsCount,
  dailyBrief as mockDailyBrief,
  todaysPriorities as mockTodaysPriorities,
  attentionItems as mockAttentionItems,
} from "@/data/mock";
import { fetchStudents, fetchTasks, fetchAIRecommendations, type RawNotionPage } from "@/lib/notion/queries.server";
import { buildDailyBrief, extractCheckbox, extractFormulaString, extractSelect, extractStatus, transformStudentToAttention, transformTaskToPriority } from "@/lib/notion/transformers";
import { isNotionConfigured } from "@/lib/notion/client.server";

export interface CommandCenterData {
  dailyBrief: DailyBrief;
  todaysPriorities: PriorityItem[];
  attentionItems: AttentionItem[];
  flaggedStudentsCount: number;
  quickActions: QuickAction[];
  source: "notion" | "fallback";
}

function isTodayPriority(page: RawNotionPage): boolean {
  return extractCheckbox(page.properties,"Due Today") || extractCheckbox(page.properties,"Is Overdue");
}
function needsAttention(page: RawNotionPage): boolean {
  const status = extractFormulaString(page.properties, "Attention Status");
  const studentStatus =
    extractSelect(page.properties, "Status") ??
    extractStatus(page.properties, "Status");

  return studentStatus === "Active" && (status === "Critical" || status === "Attention");
}

function attentionRank(page: RawNotionPage): number {
  const status = extractFormulaString(page.properties, "Attention Status");

  if (status === "Critical") return 0;
  if (status === "Attention") return 1;
  return 2;
}

export async function getCommandCenterData(): Promise<CommandCenterData> {
  if (!isNotionConfigured()) return fallbackData("NOTION_TOKEN missing");

  const [studentsResult,tasksResult,aiResult]=await Promise.all([fetchStudents(),fetchTasks(),fetchAIRecommendations()]);
  if (!studentsResult.ok || !tasksResult.ok || !aiResult.ok) {
    const failures=[studentsResult,tasksResult,aiResult].filter(r=>!r.ok).map(r=>!r.ok ? r.message : "");
    return fallbackData(failures.join(" | "));
  }

  const attentionPages=studentsResult.data
    .filter(needsAttention)
    .sort((a, b) => attentionRank(a) - attentionRank(b));
  const priorityPages=tasksResult.data.filter(isTodayPriority);
  return {
    dailyBrief: buildDailyBrief(aiResult.data,studentsResult.data,tasksResult.data),
    todaysPriorities: priorityPages.map(transformTaskToPriority),
    attentionItems: attentionPages.slice(0,6).map(transformStudentToAttention),
    flaggedStudentsCount: attentionPages.length,
    quickActions: mockQuickActions,
    source: "notion",
  };
}

function fallbackData(reason: string): CommandCenterData {
  console.warn(`Notion unavailable — using mock fallback (${reason})`);
  return { dailyBrief: mockDailyBrief, todaysPriorities: mockTodaysPriorities, attentionItems: mockAttentionItems, flaggedStudentsCount: mockFlaggedStudentsCount, quickActions: mockQuickActions, source: "fallback" };
}
