import type { LLMProvider, LLMProviderConfig } from "./provider.types";
import type { PromptDocument, PromptOutput } from "@/lib/report/prompt.types";
import { ValidationError } from "./validator.server";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export class NvidiaProvider implements LLMProvider {
  private config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;
  }

  providerName(): string {
    return "nvidia";
  }

  async generate(promptDocument: PromptDocument): Promise<PromptOutput> {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: promptDocument.system,
          },
          {
            role: "user",
            content: promptDocument.user,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `NVIDIA API request failed: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    const data = await response.json();

    const choice = data.choices?.[0];
    if (!choice?.message?.content) {
      throw new Error("NVIDIA API returned empty response");
    }

    const text = choice.message.content;

    try {
      JSON.parse(text);
    } catch (e) {
      throw new ValidationError("LLM response is not valid JSON", [
        "Response could not be parsed as JSON",
      ]);
    }

    return {
      text,
      model: this.config.model,
      generatedAt: new Date().toISOString(),
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    };
  }

  async health(): Promise<boolean> {
    try {
      const response = await fetch(
        "https://integrate.api.nvidia.com/v1/models",
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
          },
        },
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
