import type {
  AttentionItem,
  DailyBrief,
  PriorityItem,
  QuickAction,
} from "@/types/koc360";

export const dailyBrief: DailyBrief = {
  greeting: "Good morning, Coach.",
  body: "Today's focus is on 3 students. Melis is facing a major exam hurdle this week and needs a quick check-in. Your schedule is clear between 2-4 PM for deep-dive reports.",
  highlight: "3 students",
};

export const todaysPriorities: PriorityItem[] = [
  {
    id: "p1",
    category: "CRITICAL",
    title: "Finalize Melis's Study Plan",
    description: "Exam window opens in 48 hours. Logic check required on session 4.",
  },
  {
    id: "p2",
    category: "ANALYSIS",
    title: "Review Ahmet's Mock Results",
    description: "Quantitative score dropped by 12%. Identify the bottleneck.",
  },
  {
    id: "p3",
    category: "FEEDBACK",
    title: "Onboard Selin",
    description: "Welcome kit sent. Verify document submission status.",
  },
  {
    id: "p4",
    category: "REPORTING",
    title: "Weekly Summary",
    description: "Generate performance deltas for the management team.",
  },
];

export const attentionItems: AttentionItem[] = [
  {
    id: "a1",
    name: "Arda Yılmaz",
    status: "DECLINING",
    description: "Engagement dropped 40% this week. Missed last 2 attendance logs.",
    studentId: "4492",
    level: "ADV",
  },
  {
    id: "a2",
    name: "Ece Karan",
    status: "DEADLINE",
    description: "Portfolio submission due in 4 hours. No draft uploaded yet.",
    studentId: "1022",
    level: "INT",
  },
  {
    id: "a3",
    name: "Caner Tunç",
    status: "MISSING DATA",
    description: "System requires 'Parent Consent' form update for the exam.",
    studentId: "8821",
    level: "BEG",
  },
];

export const flaggedStudentsCount = 14;

export const quickActions: QuickAction[] = [
  { id: "q1", label: "Draft Student Report", icon: "edit_note" },
  { id: "q2", label: "Request Parent Meeting", icon: "groups" },
  { id: "q3", label: "Archive Completed Goals", icon: "archive" },
];
