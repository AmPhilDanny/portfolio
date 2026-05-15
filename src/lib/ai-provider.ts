/**
 * NovaxFolio AI Provider
 * 
 * This module handles communication with various AI models (Gemini, Mistral, OpenRouter).
 * It fetches API keys directly from the database to ensure a 'Zero-Setup' experience.
 */

import { db } from "./db";
import { settings } from "./schema";

interface AiCallOptions {
  model: 'gemini-vision' | 'gemini-pro' | 'mistral-large' | 'gpt-4o';
  prompt: string;
  image?: string; // URL or base64 — only valid for gemini-vision and gpt-4o
}

export async function callAi(options: AiCallOptions): Promise<{ content: string; error?: string }> {
  try {
    // 1. Fetch API Keys from DB
    const config = await db.select().from(settings).limit(1);
    const keys = config[0] || {};

    if (options.model === 'gemini-vision' || options.model === 'gemini-pro') {
      return await callGemini(options, keys.geminiApiKey);
    } else if (options.model === 'mistral-large') {
      return await callMistral(options, keys.mistralApiKey);
    } else {
      return await callOpenRouter(options, keys.openrouterApiKey, keys.openrouterModel);
    }
  } catch (error: any) {
    console.error("AI Provider Error:", error);
    return { content: "", error: error.message };
  }
}

/**
 * Call Google Gemini API
 */
async function callGemini(options: AiCallOptions, apiKey?: string | null) {
  if (!apiKey) throw new Error("Gemini API Key is missing in settings.");

  // Use Gemini 2.5 Flash — latest stable model
  const modelName = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const contents: any[] = [];
  const parts: any[] = [{ text: options.prompt }];

  if (options.image) {
    let base64Data = "";
    let mimeType = "image/png";

    if (options.image.startsWith("data:")) {
      const match = options.image.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    } else if (options.image.startsWith("http") || options.image.startsWith("/")) {
        const fullUrl = options.image.startsWith("/") ? `${process.env.NEXTAUTH_URL}${options.image}` : options.image;
        const res = await fetch(fullUrl);
        const buffer = await res.arrayBuffer();
        base64Data = Buffer.from(buffer).toString("base64");
        mimeType = res.headers.get("Content-Type") || "image/png";
    }

    if (base64Data) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
    }
  }

  contents.push({ parts });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return { content: text };
}

/**
 * Call Mistral AI API
 */
async function callMistral(options: AiCallOptions, apiKey?: string | null) {
  if (!apiKey) throw new Error("Mistral API Key is missing in settings.");

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: options.prompt }]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return { content: data.choices?.[0]?.message?.content || "" };
}

/**
 * Call OpenRouter API
 */
async function callOpenRouter(options: AiCallOptions, apiKey?: string | null, model?: string | null) {
  if (!apiKey) throw new Error("OpenRouter API Key is missing in settings.");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://novaxfolio.vercel.app", 
      "X-Title": "NovaxFolio"
    },
    body: JSON.stringify({
      model: model || "openai/gpt-4o",
      messages: [{ role: "user", content: options.prompt }]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return { content: data.choices?.[0]?.message?.content || "" };
}