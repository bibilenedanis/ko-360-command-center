export interface AIGenerationLogEntry {
  level: "info" | "warn" | "error";
  event:
    | "generation.start"
    | "generation.prompt_built"
    | "generation.provider_call"
    | "generation.response_received"
    | "generation.validation_start"
    | "generation.validation_complete"
    | "generation.complete"
    | "generation.error"
    | "health.check";
  provider?: string;
  model?: string;
  sessionId?: string;
  durationMs?: number;
  promptSize?: number;
  responseSize?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  validationPassed?: boolean;
  validationErrors?: string[];
  errorMessage?: string;
  timestamp: string;
}

export class AIGenerationLogger {
  private enabled: boolean;

  constructor(enabled: boolean = process.env.NODE_ENV === "development") {
    this.enabled = enabled;
  }

  log(entry: AIGenerationLogEntry): void {
    if (!this.enabled) return;

    const safeEntry = this.sanitize(entry);

    const message = this.formatMessage(safeEntry);

    switch (safeEntry.level) {
      case "error":
        console.error(message);
        break;
      case "warn":
        console.warn(message);
        break;
      default:
        console.log(message);
    }
  }

  logGenerationStart(provider: string, model: string, sessionId?: string): void {
    this.log({
      level: "info",
      event: "generation.start",
      provider,
      model,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  }

  logPromptBuilt(promptSize: number, wordCount: number): void {
    this.log({
      level: "info",
      event: "generation.prompt_built",
      promptSize,
      timestamp: new Date().toISOString(),
    });
  }

  logProviderCall(provider: string, model: string): void {
    this.log({
      level: "info",
      event: "generation.provider_call",
      provider,
      model,
      timestamp: new Date().toISOString(),
    });
  }

  logResponseReceived(
    model: string,
    responseSize: number,
    durationMs: number,
    tokens?: { prompt?: number; completion?: number; total?: number },
  ): void {
    this.log({
      level: "info",
      event: "generation.response_received",
      model,
      responseSize,
      durationMs,
      promptTokens: tokens?.prompt,
      completionTokens: tokens?.completion,
      totalTokens: tokens?.total,
      timestamp: new Date().toISOString(),
    });
  }

  logValidationStart(): void {
    this.log({
      level: "info",
      event: "generation.validation_start",
      timestamp: new Date().toISOString(),
    });
  }

  logValidationComplete(passed: boolean, durationMs: number, errors?: string[]): void {
    this.log({
      level: passed ? "info" : "warn",
      event: "generation.validation_complete",
      validationPassed: passed,
      durationMs,
      validationErrors: errors,
      timestamp: new Date().toISOString(),
    });
  }

  logGenerationComplete(totalDurationMs: number): void {
    this.log({
      level: "info",
      event: "generation.complete",
      durationMs: totalDurationMs,
      timestamp: new Date().toISOString(),
    });
  }

  logError(event: string, error: string): void {
    this.log({
      level: "error",
      event: "generation.error" as AIGenerationLogEntry["event"],
      errorMessage: error,
      timestamp: new Date().toISOString(),
    });
  }

  private sanitize(entry: AIGenerationLogEntry): AIGenerationLogEntry {
    const sanitized = { ...entry };

    if (sanitized.errorMessage) {
      sanitized.errorMessage = sanitized.errorMessage
        .replace(/nvapi-[a-zA-Z0-9_-]+/g, "[REDACTED]")
        .replace(/Bearer\s+[^\s]+/g, "Bearer [REDACTED]")
        .replace(/api[_-]?key[:\s]+[^\s,}]+/gi, "api_key: [REDACTED]");
    }

    return sanitized;
  }

  private formatMessage(entry: AIGenerationLogEntry): string {
    const parts: string[] = [`[AI Engine] ${entry.event}`];

    if (entry.provider) parts.push(`provider=${entry.provider}`);
    if (entry.model) parts.push(`model=${entry.model}`);
    if (entry.sessionId) parts.push(`sessionId=${entry.sessionId}`);
    if (entry.durationMs !== undefined) parts.push(`duration=${entry.durationMs}ms`);
    if (entry.promptSize !== undefined) parts.push(`promptSize=${entry.promptSize}chars`);
    if (entry.responseSize !== undefined) parts.push(`responseSize=${entry.responseSize}chars`);
    if (entry.totalTokens !== undefined) parts.push(`tokens=${entry.totalTokens}`);
    if (entry.validationPassed !== undefined)
      parts.push(`validation=${entry.validationPassed ? "passed" : "failed"}`);
    if (entry.validationErrors && entry.validationErrors.length > 0)
      parts.push(`errors=[${entry.validationErrors.join(", ")}]`);
    if (entry.errorMessage) parts.push(`error="${entry.errorMessage}"`);

    return parts.join(" ");
  }
}

export const aiLogger = new AIGenerationLogger();
