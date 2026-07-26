import { fetchStudents } from "@/lib/notion/queries.server";
import { transformStudentToListItem } from "@/lib/notion/transformers";
import type { StudentListItem } from "@/types/koc360";

export interface StudentsData {
  students: StudentListItem[];
  source: "notion";
}

function attentionRank(student: StudentListItem): number {
  if (student.attentionStatus === "Critical") return 0;
  if (student.attentionStatus === "Attention") return 1;
  return 2;
}

export async function getStudentsData(): Promise<StudentsData> {
  const result = await fetchStudents();

  if (!result.ok) {
    throw new Error(`Students could not be loaded: ${result.message}`);
  }

  const students = result.data
    .map(transformStudentToListItem)
    .sort(
      (a, b) =>
        attentionRank(a) - attentionRank(b) ||
        a.name.localeCompare(b.name, "tr"),
    );

  return {
    students,
    source: "notion",
  };
}
