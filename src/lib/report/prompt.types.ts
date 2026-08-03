/**
 * Prompt domain models for AI report generation.
 * 
 * These types are completely provider-independent and can be used
 * with OpenAI, Anthropic, Gemini, NVIDIA, OpenRouter, or any future provider.
 */

/**
 * Metadata about the generated prompt.
 */
export interface PromptMetadata {
  /** Timestamp when the prompt was generated */
  generatedAt: string;
  /** Version of the prompt template used */
  templateVersion: string;
  /** IDs of data sources that were available */
  availableSources: string[];
  /** IDs of data sources that were missing */
  missingSources: string[];
  /** Total character count of the prompt */
  characterCount: number;
  /** Total word count estimate */
  wordCount: number;
}

/**
 * A single section within the prompt.
 */
export interface PromptSection {
  /** Unique identifier for this section */
  id: string;
  /** Human-readable title for this section */
  title: string;
  /** The actual content of this section */
  content: string;
  /** Order in which this section should appear */
  order: number;
}

/**
 * A message in the prompt conversation.
 */
export interface PromptMessage {
  /** Role of the message sender */
  role: 'system' | 'user' | 'assistant';
  /** Content of the message */
  content: string;
}

/**
 * The complete prompt document ready to be sent to an LLM.
 */
export interface PromptDocument {
  /** System message that sets the AI's behavior */
  system: string;
  /** User message containing the actual request and context */
  user: string;
  /** Metadata about the prompt */
  metadata: PromptMetadata;
  /** Individual sections that make up the prompt (for debugging/inspection) */
  sections: PromptSection[];
}

/**
 * Output from the AI after processing the prompt.
 * This is a generic structure that can be extended for specific use cases.
 */
export interface PromptOutput {
  /** The raw text output from the AI */
  text: string;
  /** Model that generated this output */
  model: string;
  /** Timestamp when the output was generated */
  generatedAt: string;
  /** Number of tokens in the prompt (if available) */
  promptTokens?: number;
  /** Number of tokens in the completion (if available) */
  completionTokens?: number;
  /** Total tokens used (if available) */
  totalTokens?: number;
}
