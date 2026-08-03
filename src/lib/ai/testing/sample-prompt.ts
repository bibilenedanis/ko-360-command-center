import type { PromptDocument } from "@/lib/report/prompt.types";

export function createSamplePromptDocument(): PromptDocument {
  return {
    system: `You are an expert educational coach assistant for Koç360, a coaching platform that helps students achieve their academic and personal goals.

Your role is to generate comprehensive coaching reports based on session data, student progress, and coaching observations.

CRITICAL RULES:
- Never invent facts or make assumptions beyond the provided data
- Use ONLY the information explicitly provided in the context
- Never diagnose the student with any medical or psychological conditions
- Never label the student (e.g., "lazy", "gifted", "problematic")
- If information is missing or insufficient, explicitly state: "Insufficient evidence to determine..."
- Write like an educational coach, NOT like a psychologist or therapist
- Be constructive and solution-focused
- Be objective and evidence-based

TONE:
- Professional yet approachable
- Encouraging but realistic
- Evidence-based and specific
- Future-oriented and actionable
- Respectful of the student's autonomy and dignity`,

    user: `COACHING CONTEXT:

You are writing a coaching report for Ali Yilmaz.
Session Date: 2024-10-24
Sprint: Sprint 12

This report will be shared with the student and potentially their parents. It should be clear, actionable, and focused on growth.

---

STUDENT PROFILE:

Name: Ali Yilmaz
Student ID: STU-2024-001
Education Level: High School
Status: Active

---

SESSION NOTES:

Wins & Progress:
Ali showed significant improvement in time management this sprint. He completed 80% of his tasks on time, up from 60% last sprint. He also demonstrated strong problem-solving skills during the physics project.

Challenges & Obstacles:
Morning fatigue continues to affect his first sessions. He struggles with exam anxiety, particularly in math. Procrastination on long-term projects remains an area for growth.

Core Notes:
Ali responded well to the structured approach we tried this sprint. He seems to thrive when tasks are broken into smaller, manageable chunks. He expressed interest in trying the Pomodoro technique.

Commitments:
- Try Pomodoro technique for homework sessions
- Review math notes before each class
- Set a consistent wake-up time for morning sessions

---

ASSESSMENT DATA:

Title: Mid-term Math Assessment
Type: academic
Date: 2024-10-15
Score: 78
Result: Proficient

---

GOALS:

Active Goals:

1. Improve Math Grades
   Type: Academic
   Status: In Progress
   Target Date: 2024-12-31
   Progress: 65%

2. Develop Time Management Skills
   Type: Personal
   Status: In Progress
   Target Date: 2024-11-30
   Progress: 45%

Completed Goals:

1. Complete Physics Lab Report
   Type: Academic
   Completed: 2024-10-20

---

CURRENT SPRINT:

Title: Sprint 12
Status: Active
Focus: Academic Resilience & Time Management
End Date: 2024-11-07
Progress: 60%

---

TASKS:

Overdue Tasks (1):

1. Submit history essay draft [academic] - Due: 2024-10-22 - Status: pending

Upcoming Tasks (2):

1. Math exam preparation [academic] - Due: 2024-10-28 - Status: pending
2. Physics project presentation [academic] - Due: 2024-11-01 - Status: pending

Recently Completed Tasks (1):

1. Physics lab report [academic]

---

AI RECOMMENDATIONS:

Other Pending Recommendations (1):

1. Schedule parent-teacher meeting [Risk: medium] - Generated: 2024-10-20

---

DATA AVAILABILITY:

Available Data Sources (8):
✓ Student Profile
✓ Session Data
✓ Session Notes
✓ Assessment Data
✓ Goals
✓ Sprint Data
✓ Tasks
✓ AI Recommendations

Missing Data Sources (3):
✗ Coach Notes
✗ Parent Feedback
✗ Previous Reports

Note: When data sources are missing, explicitly state "Insufficient evidence to determine..." rather than making assumptions.

---

OUTPUT INSTRUCTIONS:

Return ONLY valid JSON.

Do not wrap inside markdown.
Do not explain.
Do not add extra text.
Do not use code fences.
Do not include any text before or after the JSON object.

Output MUST match this schema exactly:

{
  "summary": {
    "currentStatus": "One-sentence summary of the student's current standing",
    "keyInsight": "The single most important observation from available data",
    "recommendedFocus": "What the student should prioritize next"
  },
  "strengths": [
    "Evidence-based strength, grounded in provided data",
    "Another strength"
  ],
  "challenges": [
    "Evidence-based challenge, grounded in provided data",
    "Another challenge"
  ],
  "coachNotes": "Private observations for the coach, candid and actionable",
  "nextSprintFocus": [
    {
      "title": "Short label for the focus area",
      "description": "What to do and why"
    }
  ],
  "confidence": {
    "score": 0.85,
    "missingInformation": [
      "What data was missing"
    ],
    "suggestions": [
      "What to do to improve confidence"
    ]
  }
}`,

    metadata: {
      generatedAt: "2024-10-24T12:00:00.000Z",
      templateVersion: "1.0.0",
      availableSources: [
        "student",
        "session",
        "session-notes",
        "assessment",
        "goals",
        "sprint",
        "tasks",
        "recommendations",
      ],
      missingSources: ["coach-notes", "parent-feedback", "previous-reports"],
      characterCount: 5847,
      wordCount: 983,
    },
    sections: [],
  };
}
