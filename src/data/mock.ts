import type {
  AttentionItem,
  DailyBrief,
  PriorityItem,
  QuickAction,
} from "@/types/koc360";

export const dailyBrief: DailyBrief = {
  greeting: "Günaydın, Koç.",
  body: "Bugünün odağı 3 öğrenci. Melis bu hafta önemli bir sınav dönemine giriyor ve hızlı bir kontrol gerektiriyor. 14-16 arası derinlemesine raporlar için müsaitsiniz.",
  highlight: "3 öğrenci",
};

export const todaysPriorities: PriorityItem[] = [
  {
    id: "p1",
    category: "CRITICAL",
    title: "Melis'in çalışma planını tamamla",
    description: "Sınav dönemi 48 saat içinde açılıyor. 4. oturumda mantık kontrolü gerekli.",
  },
  {
    id: "p2",
    category: "ANALYSIS",
    title: "Ahmet'in deneme sonuçlarını incele",
    description: "Sayısal skor %12 düştü. Darboğazı belirle.",
  },
  {
    id: "p3",
    category: "FEEDBACK",
    title: "Selin'i sürece dahil et",
    description: "Karşılama kiti gönderildi. Belge teslim durumunu doğrula.",
  },
  {
    id: "p4",
    category: "REPORTING",
    title: "Haftalık özet",
    description: "Yönetim ekibi için performans değişimlerini oluştur.",
  },
];

export const attentionItems: AttentionItem[] = [
  {
    id: "a1",
    name: "Arda Yılmaz",
    status: "DECLINING",
    description: "Bu hafta katılım %40 düştü. Son 2 devam kaydı eksik.",
    studentId: "4492",
    level: "ADV",
  },
  {
    id: "a2",
    name: "Ece Karan",
    status: "DEADLINE",
    description: "Portfolyo teslimi 4 saat içinde. Henüz taslak yüklenmedi.",
    studentId: "1022",
    level: "INT",
  },
  {
    id: "a3",
    name: "Caner Tunç",
    status: "MISSING DATA",
    description: "Sistem, sınav için 'Veli Onayı' formunun güncellenmesini gerektiriyor.",
    studentId: "8821",
    level: "BEG",
  },
];

export const flaggedStudentsCount = 14;

export const quickActions: QuickAction[] = [
  { id: "q1", label: "Öğrenci raporu taslağı", icon: "edit_note" },
  { id: "q2", label: "Veli görüşmesi talep et", icon: "groups" },
  { id: "q3", label: "Tamamlanan hedefleri arşivle", icon: "archive" },
];
