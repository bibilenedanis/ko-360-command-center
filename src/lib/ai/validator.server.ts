import type { AIResponse, AIResponseSection } from "./response.types";
import type { PromptOutput } from "@/lib/report/prompt.types";

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: string[]
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateAndParseResponse(
  output: PromptOutput,
  sessionId: string,
  studentId: string
): AIResponse {
  const errors: string[] = [];
  const text = output.text.trim();

  if (!text || text.length < 100) {
    errors.push("Response is too short or empty");
  }

  const { metadata, content } = extractMetadata(text);
  
  if (!metadata) {
    errors.push("Could not parse JSON metadata from response");
  }

  const sections = parseMarkdownSections(content || text);
  
  if (sections.length === 0) {
    errors.push("No markdown sections found in response");
  }

  if (errors.length > 0) {
    throw new ValidationError(
      `Response validation failed with ${errors.length} error(s)`,
      errors
    );
  }

  const wordCount = (content || text).split(/\s+/).length;
  
  return {
    reportType: metadata?.reportType || "session",
    studentId: metadata?.studentId || studentId,
    sessionId: metadata?.sessionId || sessionId,
    generatedAt: metadata?.generatedAt || new Date().toISOString(),
    confidence: metadata?.confidence || 0.8,
    sourcesUsed: metadata?.sourcesUsed || [],
    sourcesMissing: metadata?.sourcesMissing || [],
    wordCount: metadata?.wordCount || wordCount,
    sections: sections,
    rawMarkdown: content || text,
    metadata: {
      providerName: output.model.split("/")[0] || "unknown",
      model: output.model,
      promptTokens: output.promptTokens,
      completionTokens: output.completionTokens,
      totalTokens: output.totalTokens,
      validationPassed: true,
      validationErrors: [],
      validatedAt: new Date().toISOString(),
    },
  };
}

function extractMetadata(text: string): {
  metadata: Partial<AIResponse> | null;
  content: string | null;
} {
  const jsonBlockMatch = text.match(/```json\s*\n([\s\S]*?)\n```/);
  
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      const metadata = JSON.parse(jsonBlockMatch[1]);
      const content = text.slice(jsonBlockMatch[0].length).trim();
      return { metadata, content };
    } catch (e) {
      console.error("Failed to parse JSON metadata:", e);
    }
  }

  const lines = text.split("\n");
  let jsonStart = -1;
  let jsonEnd = -1;
  let braceCount = 0;
  let inJson = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim().startsWith("{") && !inJson) {
      jsonStart = i;
      inJson = true;
    }
    
    if (inJson) {
      for (const char of line) {
        if (char === "{") braceCount++;
        if (char === "}") braceCount--;
      }
      
      if (braceCount === 0 && jsonStart !== -1) {
        jsonEnd = i;
        break;
      }
    }
  }

  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonText = lines.slice(jsonStart, jsonEnd + 1).join("\n");
    try {
      const metadata = JSON.parse(jsonText);
      const contentLines = [
        ...lines.slice(0, jsonStart),
        ...lines.slice(jsonEnd + 1)
      ];
      const content = contentLines.join("\n").trim();
      return { metadata, content };
    } catch (e) {
      console.error("Failed to parse JSON metadata:", e);
    }
  }

  return { metadata: null, content: null };
}

function parseMarkdownSections(markdown: string): AIResponseSection[] {
  const sections: AIResponseSection[] = [];
  const headingRegex = /^##\s+(.+)$/gm;
  
  const matches: Array<{ heading: string; index: number; level: number }> = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[0].match(/^#+/)?.[0].length || 2;
    matches.push({
      heading: match[1].trim(),
      index: match.index,
      level,
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    
    const contentStart = current.index + markdown.slice(current.index).indexOf("\n") + 1;
    const contentEnd = next ? next.index : markdown.length;
    
    const content = markdown.slice(contentStart, contentEnd).trim();
    
    sections.push({
      id: `section-${i}`,
      title: current.heading,
      content: content,
      order: i,
    });
  }

  return sections;
}
