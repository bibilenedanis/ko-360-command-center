/**
 * Structured AI response format.
 * This is the validated and parsed response from the AI that can be rendered in the UI.
 */

export interface AIResponse {
  reportType: string;
  studentId: string;
  sessionId: string;
  generatedAt: string;
  confidence: number;
  sourcesUsed: string[];
  sourcesMissing: string[];
  wordCount: number;
  sections: AIResponseSection[];
  rawMarkdown: string;
  metadata: AIResponseMetadata;
}

export interface AIResponseSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface AIResponseMetadata {
  providerName: string;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  validationPassed: boolean;
  validationErrors: string[];
  validatedAt: string;
}
