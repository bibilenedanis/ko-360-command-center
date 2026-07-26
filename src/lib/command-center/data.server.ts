import type {
  AttentionItem,
  DailyBrief,
  PriorityItem,
  QuickAction,
} from "@/types/koc360";
import { quickActions as mockQuickActions, flaggedStudentsCount as mockFlaggedStudentsCount } from "@/data/mock";
import { fetchTasks, fetchAIRecommendations, type RawNotionPage } from "@/lib/notion/queries.server";
import {
  transformTaskToPriority,
  transformTaskToAttention,
  transformAIRecommendationToDailyBrief,
} from "@/lib/notion/transformers";
import { testNotionConnection } from "@/lib/notion/connection.server";
import { isNotionConfigured } from "@/lib/notion/client.server";

export interface CommandCenterData {
  dailyBrief: DailyBrief;
  todaysPriorities: PriorityItem[];
  attentionItems: AttentionItem[];
  flaggedStudentsCount: number;
  quickActions: QuickAction[];
  source: "notion" | "fallback";
}

import {
  dailyBrief as mockDailyBrief,
  todaysPriorities as mockTodaysPriorities,
  attentionItems as mockAttentionItems,
} from "@/data/mock";

function isPriorityTask(page: RawNotionPage): boolean {
  const props = page.properties as Record<string, unknown>;
  const statusField = Object.keys(props).find((k) => /status|durum/i.test(k));
  if (!statusField) return true;
  const raw = props[statusField] as { status?: { name?: string } } | undefined;
  const statusName = raw?.status?.name?.toLowerCase() ?? "";
  return !["done", "completed", "tamam", "kapali", "kapalı"].includes(statusName);
}

function isAttentionTask(page: RawNotionPage): boolean {
  const props = page.properties as Record<string, unknown>;
  const studentField = Object.keys(props).find((k) => /student|öğrenci|name|isim|ad/i.test(k));
  return Boolean(studentField);
}

export async function getCommandCenterData(): Promise<CommandCenterData> {
  if (!isNotionConfigured()) {
    console.warn("Notion unavailable — using mock fallback (NOTION_TOKEN missing)");
    return fallbackData();
  }

  const connection = await testNotionConnection();
  const tasksOk = connection.tasksDatabase === "connected";
  const aiRecsOk = connection.aiRecommendationsDatabase === "connected";

  if (!tasksOk && !aiRecsOk) {
    console.warn("Notion unavailable — using mock fallback (both databases unreachable)");
    return fallbackData();
  }

  const [tasksResult, aiRecsResult] = await Promise.all([
    tasksOk ? fetchTasks() : Promise.resolve({ ok: false as const, reason: "not_configured" as const, message: "tasks database unreachable" }),
    aiRecsOk ? fetchAIRecommendations() : Promise.resolve({ ok: false as const, reason: "not_configured" as const, message: "ai recommendations database unreachable" }),
  ]);

  let dailyBrief: DailyBrief = mockDailyBrief;
  let todaysPriorities: PriorityItem[] = [];
  let attentionItems: AttentionItem[] = [];

  if (aiRecsResult.ok) {
    const first = aiRecsResult.data[0];
    if (first) {
      dailyBrief = transformAIRecommendationToDailyBrief(first);
    } else {
      console.warn("Notion: AI recommendations empty — using mock dailyBrief");
    }
  } else if (aiRecsResult.reason !== "not_configured") {
    console.warn(`Notion: AI recommendations query failed (${aiRecsResult.reason}) — using mock dailyBrief`);
  }

  if (tasksResult.ok) {
    const priorityPages = tasksResult.data.filter(isPriorityTask);
    const attentionPages = tasksResult.data.filter(isAttentionTask);
    todaysPriorities = priorityPages.map((p) => transformTaskToPriority(p));
    attentionItems = attentionPages.map((p) => transformTaskToAttention(p));
    if (todaysPriorities.length === 0) {
      console.warn("Notion: no priority tasks derived — todaysPriorities empty");
    }
    if (attentionItems.length === 0) {
      console.warn("Notion: no attention items derived — attentionItems empty");
    }
  } else if (tasksResult.reason !== "not_configured") {
    console.warn(`Notion: tasks query failed (${tasksResult.reason}) — using mock fallback`);
    return fallbackData();
  }

  const flaggedStudentsCount = attentionItems.length > 0 ? attentionItems.length : mockFlaggedStudentsCount;

  return {
    dailyBrief,
    todaysPriorities,
    attentionItems,
    flaggedStudentsCount,
    quickActions: mockQuickActions,
    source: "notion",
  };
}

function fallbackData(): CommandCenterData {
  return {
    dailyBrief: mockDailyBrief,
    todaysPriorities: mockTodaysPriorities,
    attentionItems: mockAttentionItems,
    flaggedStudentsCount: mockFlaggedStudentsCount,
    quickActions: mockQuickActions,
    source: "fallback",
  };
}
