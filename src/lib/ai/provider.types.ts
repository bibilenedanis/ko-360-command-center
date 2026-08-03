import type { PromptDocument, PromptOutput } from "@/lib/report/prompt.types";

export interface ProviderHealthResult {
  healthy: boolean;
  provider: string;
  model: string;
  checks: {
    apiReachable: boolean;
    modelExists: boolean;
    apiKeyValid: boolean;
  };
  error?: string;
  checkedAt: string;
}

export interface LLMProvider {
  providerName(): string;
  generate(promptDocument: PromptDocument): Promise<PromptOutput>;
  health(): Promise<ProviderHealthResult>;
}

export interface LLMProviderConfig {
  apiKey: string;
  model: string;
}

export type LLMProviderName = "nvidia" | "openai" | "anthropic" | "openrouter" | "ollama";
