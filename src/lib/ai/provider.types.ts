import type { PromptDocument, PromptOutput } from "@/lib/report/prompt.types";

export interface LLMProvider {
  providerName(): string;
  generate(promptDocument: PromptDocument): Promise<PromptOutput>;
  health(): Promise<boolean>;
}

export interface LLMProviderConfig {
  apiKey: string;
  model: string;
}

export type LLMProviderName = "nvidia" | "openai" | "anthropic" | "openrouter" | "ollama";
