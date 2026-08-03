import { createServerFn } from "@tanstack/react-start";
import { buildReportContext } from "./context.server";
import { buildReportPrompt } from "./prompt.builder";
import { getLLMProvider } from "@/lib/ai/provider.factory";
import { validateReportOutput, ValidationError } from "@/lib/ai/validator.server";
import type { ReportOutput } from "@/lib/ai/schema";
import { aiLogger } from "@/lib/ai/logger";
import { createDraft } from "./report.repository.server";
import type { ReportRecord } from "./report-record.types";
import { PROMPT_TEMPLATE_VERSION } from "./prompt.templates";

export const generateReportOutput = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("sessionId" in data)) {
      throw new Error("sessionId is required");
    }
    return data as { sessionId: string };
  })
  .handler(async ({ data }): Promise<ReportRecord> => {
    const { sessionId } = data;
    const totalStart = Date.now();

    try {
      const context = await buildReportContext(sessionId);
      const studentId = context.student.id;

      const prompt = buildReportPrompt(context);
      aiLogger.logPromptBuilt(prompt.metadata.characterCount, prompt.metadata.wordCount);

      const provider = getLLMProvider();
      const providerName = provider.providerName();
      const model = process.env.NVIDIA_MODEL || "openai/gpt-oss-120b";

      aiLogger.logGenerationStart(providerName, model, sessionId);
      aiLogger.logProviderCall(providerName, model);

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

      const sourceCoverage = prompt.metadata.availableSources.length /
        (prompt.metadata.availableSources.length + prompt.metadata.missingSources.length);

      const draft = await createDraft({
        studentId,
        sessionId,
        reportOutput,
        promptVersion: PROMPT_TEMPLATE_VERSION,
        provider: providerName,
        model,
        confidence: reportOutput.confidence.score,
        sourceCoverage,
        generationDuration: totalDuration,
      });

      return draft;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      aiLogger.logError("generation.pipeline", errorMessage);
      throw error;
    }
  });

export { ValidationError };
