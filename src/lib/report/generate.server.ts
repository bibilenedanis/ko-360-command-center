import { createServerFn } from "@tanstack/react-start";
import { buildReportContext } from "./context.server";
import { buildReportPrompt } from "./prompt.builder";
import { getLLMProvider } from "@/lib/ai/provider.factory";
import { validateReportOutput, ValidationError } from "@/lib/ai/validator.server";
import type { ReportOutput } from "@/lib/ai/schema";
import { aiLogger } from "@/lib/ai/logger";

export const generateReportOutput = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("sessionId" in data)) {
      throw new Error("sessionId is required");
    }
    return data as { sessionId: string };
  })
  .handler(async ({ data }): Promise<ReportOutput> => {
    const { sessionId } = data;
    const totalStart = Date.now();

    try {
      const context = await buildReportContext(sessionId);

      const prompt = buildReportPrompt(context);
      aiLogger.logPromptBuilt(prompt.metadata.characterCount, prompt.metadata.wordCount);

      const provider = getLLMProvider();
      aiLogger.logGenerationStart(provider.providerName(), "configured", sessionId);
      aiLogger.logProviderCall(provider.providerName(), "configured");

      const providerStart = Date.now();
      const output = await provider.generate(prompt);
      const providerDuration = Date.now() - providerStart;

      aiLogger.logResponseReceived(
        output.model,
        output.text.length,
        providerDuration,
        {
          prompt: output.promptTokens,
          completion: output.completionTokens,
          total: output.totalTokens,
        },
      );

      aiLogger.logValidationStart();
      const validationStart = Date.now();
      const reportOutput = validateReportOutput(output);
      const validationDuration = Date.now() - validationStart;

      aiLogger.logValidationComplete(true, validationDuration);

      const totalDuration = Date.now() - totalStart;
      aiLogger.logGenerationComplete(totalDuration);

      return reportOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      aiLogger.logError("generation.pipeline", errorMessage);
      throw error;
    }
  });

export { ValidationError };
