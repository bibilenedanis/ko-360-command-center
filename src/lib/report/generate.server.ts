import { createServerFn } from "@tanstack/react-start";
import { buildReportContext } from "./context.server";
import { buildReportPrompt } from "./prompt.builder";
import { getLLMProvider } from "@/lib/ai/provider.factory";
import { validateReportOutput, ValidationError } from "@/lib/ai/validator.server";
import type { ReportOutput } from "@/lib/ai/schema";

export const generateReportOutput = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("sessionId" in data)) {
      throw new Error("sessionId is required");
    }
    return data as { sessionId: string };
  })
  .handler(async ({ data }): Promise<ReportOutput> => {
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
      console.log("\nRaw response (first 500 chars):");
      console.log(output.text.substring(0, 500));
      console.log("\n=== End of LLM Response ===\n");
    }

    const reportOutput = validateReportOutput(output);

    if (process.env.NODE_ENV === "development") {
      console.log("\n=== Validated Report Output ===");
      console.log("Summary keys:", Object.keys(reportOutput.summary));
      console.log("Strengths count:", reportOutput.strengths.length);
      console.log("Challenges count:", reportOutput.challenges.length);
      console.log("Next sprint focus count:", reportOutput.nextSprintFocus.length);
      console.log("Confidence score:", reportOutput.confidence.score);
      console.log("\n=== End of Validated Report Output ===\n");
    }

    return reportOutput;
  });

export { ValidationError };
