/**
 * AI Provider Layer
 * 
 * This service routes AI requests to various providers based on the task:
 * - Gemini: Vision tasks (Screenshot analysis)
 * - Mistral: High-quality text generation and strategy
 * - OpenRouter: Creative content and fallback models
 */

export type AiModel = 'gemini-vision' | 'mistral-large' | 'openrouter-creative';

export interface AiRequest {
  model: AiModel;
  prompt: string;
  image?: string; // Base64 encoded image for vision tasks
}

export interface AiResponse {
  content: string;
  raw?: any;
  error?: string;
}

export async function callAi(request: AiRequest): Promise<AiResponse> {
  const { model, prompt, image } = request;

  try {
    if (model === 'gemini-vision') {
      return await callGeminiVision(prompt, image);
    } else if (model === 'mistral-large') {
      return await callMistral(prompt);
    } else {
      return await callOpenRouter(prompt);
    }
  } catch (error: any) {
    console.error(`AI call failed (${model}):`, error.message);
    return { 
      content: "", 
      error: error.message || "Unknown AI error" 
    };
  }
}

/**
 * Google Gemini Vision Implementation
 */
async function callGeminiVision(prompt: string, image?: string): Promise<AiResponse> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return mockVisionResponse(prompt);
  }

  // Implementation for Gemini API would go here
  // For now, returning mock to allow UI development
  return mockVisionResponse(prompt);
}

/**
 * Mistral AI Implementation
 */
async function callMistral(prompt: string): Promise<AiResponse> {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return mockTextResponse("Mistral", prompt);
  }

  // Implementation for Mistral API
  return mockTextResponse("Mistral", prompt);
}

/**
 * OpenRouter Implementation
 */
async function callOpenRouter(prompt: string): Promise<AiResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return mockTextResponse("OpenRouter", prompt);
  }

  // Implementation for OpenRouter API
  return mockTextResponse("OpenRouter", prompt);
}

/**
 * MOCK RESPONSES FOR DEVELOPMENT
 * These allow the UI to be built and tested without active API keys.
 */

function mockVisionResponse(prompt: string): AiResponse {
  return {
    content: JSON.stringify({
      platform: "X (formerly Twitter)",
      handle: "@AmPhilDanny",
      followers: "1,240",
      following: "450",
      engagement_rate: "3.2%",
      summary: "Steady growth observed over the last 30 days. Engagement is highest on technical posts related to Data Analysis."
    }),
    raw: { status: "mocked" }
  };
}

function mockTextResponse(provider: string, prompt: string): AiResponse {
  return {
    content: `[MOCK ${provider}] Based on your growth goals, I recommend posting more about your latest portfolio projects. Here's a draft: "Just updated my portfolio with a new AI Social Media Strategist tool! 🚀 #DataAnalysis #FullStack #AI"`,
    raw: { status: "mocked" }
  };
}
