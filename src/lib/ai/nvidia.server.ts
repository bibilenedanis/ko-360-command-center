import type { LLMProvider, LLMProviderConfig, ProviderHealthResult } from "./provider.types";
import type { PromptDocument, PromptOutput } from "@/lib/report/prompt.types";
import { ValidationError } from "./validator.server";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODELS_URL = "https://integrate.api.nvidia.com/v1/models";

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

  async health(): Promise<ProviderHealthResult> {
    const result: ProviderHealthResult = {
      healthy: false,
      provider: "nvidia",
      model: this.config.model,
      checks: {
        apiReachable: false,
        modelExists: false,
        apiKeyValid: false,
      },
      checkedAt: new Date().toISOString(),
    };

    try {
      const modelsResponse = await fetch(NVIDIA_MODELS_URL, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      });

      result.checks.apiReachable = modelsResponse.ok;

      if (modelsResponse.status === 401 || modelsResponse.status === 403) {
        result.checks.apiKeyValid = false;
        result.error = "API key is invalid or expired";
        return result;
      }

      result.checks.apiKeyValid = modelsResponse.ok;

      if (!modelsResponse.ok) {
        result.error = `Models endpoint returned ${modelsResponse.status}`;
        return result;
      }

      const modelsData = await modelsResponse.json();
      const models: Array<{ id: string }> = modelsData.data || [];
      result.checks.modelExists = models.some((m) => m.id === this.config.model);

      if (!result.checks.modelExists) {
        result.error = `Model '${this.config.model}' not found in available models`;
        return result;
      }

      result.healthy = true;
    } catch (e) {
      result.error = e instanceof Error ? e.message : "Unknown error during health check";
    }

    return result;
  }
}
