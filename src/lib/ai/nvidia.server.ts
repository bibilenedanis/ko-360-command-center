import type { LLMProvider, LLMProviderConfig } from "./provider.types";
import type { PromptDocument, PromptOutput } from "@/lib/report/prompt.types";

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
    const startTime = Date.now();

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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `NVIDIA API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    const duration = Date.now() - startTime;

    const choice = data.choices?.[0];
    if (!choice?.message?.content) {
      throw new Error("NVIDIA API returned empty response");
    }

    return {
      text: choice.message.content,
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
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
