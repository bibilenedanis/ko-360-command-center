import { createServerFn } from "@tanstack/react-start";
import { buildReportContext } from "./context.server";
import { buildReportPrompt } from "./prompt.builder";
import type { PromptDocument } from "./prompt.types";

export const generateReportPrompt = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("sessionId" in data)) {
      throw new Error("sessionId is required");
    }
    return data as { sessionId: string };
  })
  .handler(async ({ data }): Promise<PromptDocument> => {
    const { sessionId } = data;
    
    // Build the report context from Notion data
    const context = await buildReportContext(sessionId);
    
    // Build the prompt document
    const prompt = buildReportPrompt(context);
    
    // In development mode, log the prompt to console
    if (process.env.NODE_ENV === "development") {
      console.log("\n=== Generated Prompt Document ===");
      console.log("Metadata:", JSON.stringify(prompt.metadata, null, 2));
      console.log("\nSystem Prompt (first 500 chars):");
      console.log(prompt.system.substring(0, 500));
      console.log("\nUser Prompt (first 500 chars):");
      console.log(prompt.user.substring(0, 500));
      console.log("\n=== End of Prompt Document ===\n");
    }
    
    return prompt;
  });
