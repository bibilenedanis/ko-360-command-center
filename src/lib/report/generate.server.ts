import { createServerFn } from "@tanstack/react-start";
import { buildReportContext } from "./context.server";
import { buildReportPrompt } from "./prompt.builder";
import { getLLMProvider } from "@/lib/ai/provider.factory";
import { validateAndParseResponse } from "@/lib/ai/validator.server";
import type { PromptDocument } from "./prompt.types";
import type { AIResponse } from "@/lib/ai/response.types";

export const generateReportPrompt = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("sessionId" in data)) {
      throw new Error("sessionId is required");
    }
    return data as { sessionId: string };
  })
  .handler(async ({ data }): Promise<AIResponse> => {
    const { sessionId } = data;
    
    const context = await buildReportContext(sessionId);
    
    const prompt = buildReportPrompt(context);
    
    if (process.env.NODE_ENV === "development") {
      console.log("\n=== Generated Prompt Document ===");
      console.log("Metadata:", JSON.stringify(prompt.metadata, null, 2));
      console.log("\nSystem Prompt (first 500 chars):");
      console.log(prompt.system.substring(0, 500));
      console.log("\nUser Prompt (first 500 chars):");
      console.log(prompt.user.substring(0, 500));
      console.log("\n=== End of Prompt Document ===\n");
    }
    
    const provider = getLLMProvider();
    
    if (process.env.NODE_ENV === "development") {
      console.log(`\n=== Calling LLM Provider: ${provider.providerName()} ===\n`);
    }
    
    const output = await provider.generate(prompt);
    
    if (process.env.NODE_ENV === "development") {
      console.log("\n=== LLM Response Received ===");
      console.log("Model:", output.model);
      console.log("Tokens:", output.totalTokens);
      console.log("Response length:", output.text.length);
      console.log("\n=== End of LLM Response ===\n");
    }
    
    const studentId = context.student.id;
    const response = validateAndParseResponse(output, sessionId, studentId);
    
    if (process.env.NODE_ENV === "development") {
      console.log("\n=== Validated AI Response ===");
      console.log("Report Type:", response.reportType);
      console.log("Word Count:", response.wordCount);
      console.log("Sections:", response.sections.length);
      console.log("Confidence:", response.confidence);
      console.log("Sources Used:", response.sourcesUsed);
      console.log("\n=== End of Validated Response ===\n");
    }
    
    return response;
  });
