export interface DailyBrief {
  greeting: string;
  body: string;
  highlight?: string;
}

export type PriorityCategory = "CRITICAL" | "ANALYSIS" | "FEEDBACK" | "REPORTING";

export interface PriorityItem {
  id: string;
  category: PriorityCategory;
  title: string;
  description: string;
}

export type AttentionStatus = "DECLINING" | "DEADLINE" | "MISSING DATA";
export type StudentLevel = "BEG" | "INT" | "ADV";

export interface AttentionItem {
  id: string;
  name: string;
  status: AttentionStatus;
  description: string;
  studentId: string;
  level: StudentLevel;
}

export type QuickActionIcon = "edit_note" | "groups" | "archive";

export interface QuickAction {
  id: string;
  label: string;
  icon: QuickActionIcon;
}

export type StudentAttentionStatus = "Critical" | "Attention" | "On Track";

export interface StudentListItem {
  id: string;
  name: string;
  studentId: string;
  educationLevel: string;
  status: string;
  attentionStatus: StudentAttentionStatus;
  attentionReason: string;
}
