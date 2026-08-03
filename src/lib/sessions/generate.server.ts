import { createServerFn } from "@tanstack/react-start";
import { buildSessionContext } from "./context.server";
import { buildSessionBriefPrompt } from "./prompt.builder";
import { validateSessionBrief, SessionBriefValidationError } from "./validator.server";
import { createSessionBrief } from "./repository.server";
import { getLLMProvider } from "@/lib/ai/provider.factory";
import { aiLogger } from "@/lib/ai/logger";
import type { SessionBriefRecord } from "./repository.server";
import { PROMPT_TEMPLATE_VERSION } from "@/lib/report/prompt.templates";

export const generateSessionBrief = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("sessionId" in data)) {
      throw new Error("sessionId is required");
    }
    return data as { sessionId: string };
  })
  .handler(async ({ data }): Promise<SessionBriefRecord> => {
    const { sessionId } = data;
    const totalStart = Date.now();

    try {
      const context = await buildSessionContext(sessionId);
      const studentId = context.student.id;

      const prompt = buildSessionBriefPrompt(context);
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
        }
      );

      aiLogger.logValidationStart();
      const validationStart = Date.now();
      const brief = validateSessionBrief(output);
      const validationDuration = Date.now() - validationStart;

      aiLogger.logValidationComplete(true, validationDuration);

      const totalDuration = Date.now() - totalStart;
      aiLogger.logGenerationComplete(totalDuration);

      const record = await createSessionBrief({
        sessionId,
        studentId,
        brief,
        promptVersion: PROMPT_TEMPLATE_VERSION,
        provider: providerName,
        model,
        confidence: brief.confidence,
        generationDuration: totalDuration,
      });

      return record;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      aiLogger.logError("session_brief.pipeline", errorMessage);
      throw error;
    }
  });

export { SessionBriefValidationError };
