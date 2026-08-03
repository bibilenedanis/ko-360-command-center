import type { LLMProvider, LLMProviderName } from "./provider.types";
import { NvidiaProvider } from "./nvidia.server";

export function getLLMProvider(): LLMProvider {
  const providerName = (process.env.LLM_PROVIDER || "nvidia").toLowerCase() as LLMProviderName;

  switch (providerName) {
    case "nvidia": {
      const apiKey = process.env.NVIDIA_API_KEY;
      const model = process.env.NVIDIA_MODEL || "openai/gpt-oss-120b";

      if (!apiKey) {
        throw new Error("NVIDIA_API_KEY environment variable is not set");
      }

      return new NvidiaProvider({ apiKey, model });
    }

    default:
      throw new Error(`Unsupported LLM provider: ${providerName}`);
  }
}
