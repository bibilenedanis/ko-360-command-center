// Presentation-layer localization for Koç360.
// Backend/Notion values remain in English; only the displayed label is translated.

const STATUS_LABELS: Record<string, string> = {
  // Attention
  Critical: "Kritik",
  Attention: "Dikkat Gerekiyor",
  "On Track": "Yolunda",
  // Student status
  Active: "Aktif",
  Inactive: "Pasif",
  "At Risk": "Risk Altında",
  // Priority
  High: "Yüksek",
  Medium: "Orta",
  Low: "Düşük",
  // Task / recommendation status
  Pending: "Bekliyor",
  "Pending Review": "İnceleme Bekliyor",
  "To Do": "Yapılacak",
  Todo: "Yapılacak",
  Overdue: "Gecikmiş",
  Completed: "Tamamlandı",
  Done: "Tamamlandı",
  "In Progress": "Devam Ediyor",
  Ongoing: "Devam Ediyor",
  New: "Yeni",
  Open: "Açık",
  Blocked: "Engellendi",
  Cancelled: "İptal",
  Canceled: "İptal",
};

export function localizeStatus(value: string | null | undefined): string {
  if (!value) return "";
  const key = value.trim();
  if (!key) return "";
  if (STATUS_LABELS[key]) return STATUS_LABELS[key];
  // case-insensitive
  const found = Object.keys(STATUS_LABELS).find(
    (k) => k.toLowerCase() === key.toLowerCase(),
  );
  return found ? STATUS_LABELS[found] : value;
}

// Priority category (CRITICAL / ANALYSIS / FEEDBACK / REPORTING)
const CATEGORY_LABELS: Record<string, string> = {
  CRITICAL: "KRİTİK",
  ANALYSIS: "ANALİZ",
  FEEDBACK: "GERİ BİLDİRİM",
  REPORTING: "RAPORLAMA",
};
export function localizeCategory(value: string): string {
  return CATEGORY_LABELS[value] ?? value;
}

// Attention item status codes
const ATTENTION_CODE_LABELS: Record<string, string> = {
  DECLINING: "DÜŞÜŞTE",
  DEADLINE: "SON TARİH",
  "MISSING DATA": "EKSİK VERİ",
};
export function localizeAttentionCode(value: string): string {
  return ATTENTION_CODE_LABELS[value] ?? value;
}

// Student level (BEG / INT / ADV)
const LEVEL_LABELS: Record<string, string> = {
  BEG: "BAŞ",
  INT: "ORT",
  ADV: "İLE",
};
export function localizeLevel(value: string): string {
  return LEVEL_LABELS[value] ?? value;
}

// Date helpers using Turkish locale
export function formatDayTR(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric" });
  } catch {
    return iso;
  }
}
export function formatMonthTR(iso: string): string {
  try {
    return new Date(iso)
      .toLocaleDateString("tr-TR", { month: "short" })
      .replace(".", "")
      .toUpperCase();
  } catch {
    return "";
  }
}
export function formatShortDateTR(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

// Translate the free-form Notion-generated "Attention Reason" formula strings
// and similar signal strings into natural Turkish. Best-effort; if no rule
// matches a fragment, it is kept as-is (never break the UI).
export function localizeSignalText(input: string | null | undefined): string {
  if (!input) return "";
  let out = input;

  // Numeric-fragment substitutions with proper Turkish pluralization
  // e.g. "2 overdue task(s)" -> "2 gecikmiş görev"
  const rules: Array<{ re: RegExp; tr: (n: string) => string }> = [
    {
      re: /(\d+)\s+high-risk\s+AI\s+recommendation(?:\(s\)|s)?/gi,
      tr: (n) => `${n} yüksek riskli AI önerisi`,
    },
    {
      re: /(\d+)\s+high-risk\s+AI\s+signal(?:\(s\)|s)?/gi,
      tr: (n) => `${n} yüksek riskli AI sinyali`,
    },
    {
      re: /(\d+)\s+at-risk\s+goal(?:\(s\)|s)?/gi,
      tr: (n) => `${n} risk altındaki hedef`,
    },
    {
      re: /(\d+)\s+overdue\s+task(?:\(s\)|s)?/gi,
      tr: (n) => `${n} gecikmiş görev`,
    },
    {
      re: /(\d+)\s+AI\s+recommendation(?:\(s\)|s)?\s+pending\s+review/gi,
      tr: (n) => `${n} inceleme bekleyen AI önerisi`,
    },
    {
      re: /(\d+)\s+AI\s+recommendation(?:\(s\)|s)?\s+awaiting\s+review/gi,
      tr: (n) => `${n} inceleme bekleyen AI önerisi`,
    },
    {
      re: /(\d+)\s+critical\s+student(?:\(s\)|s)?/gi,
      tr: (n) => `${n} kritik öğrenci`,
    },
    {
      re: /(\d+)\s+task(?:\(s\)|s)?\s+due\s+today/gi,
      tr: (n) => `${n} bugün son tarihli görev`,
    },
    {
      re: /(\d+)\s+open\s+goal(?:\(s\)|s)?/gi,
      tr: (n) => `${n} açık hedef`,
    },
    {
      re: /(\d+)\s+active\s+sprint(?:\(s\)|s)?/gi,
      tr: (n) => `${n} aktif sprint`,
    },
    {
      re: /(\d+)\s+upcoming\s+session(?:\(s\)|s)?/gi,
      tr: (n) => `${n} yaklaşan görüşme`,
    },
  ];
  for (const r of rules) {
    out = out.replace(r.re, (_m, n: string) => r.tr(n));
  }

  // Loose phrase fallbacks
  out = out
    .replace(/attention required/gi, "dikkat gerekiyor")
    .replace(/no active attention signals?/gi, "Aktif dikkat sinyali yok")
    .replace(/^Today:\s*/i, "Bugün: ")
    .replace(/Good morning, Coach\.?/gi, "Günaydın, Koç.");

  return out;
}
