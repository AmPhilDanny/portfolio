/**
 * NovaxFolio AI Provider
 *
 * Handles communication with Gemini, Mistral, and OpenRouter.
 * OpenRouter is configured to use `openrouter/auto` — the free smart router
 * that automatically selects the best available free model for each request.
 *
 * API keys are fetched from the database at call-time (Zero-Setup).
 */

import { getDb } from "./db";
import type { Db } from "mongodb";

interface AiCallOptions {
  model: 'gemini-vision' | 'gemini-pro' | 'mistral-large' | 'gpt-4o';
  prompt: string;
  image?: string; // URL or base64 — only valid for gemini-vision
}

export async function callAi(options: AiCallOptions): Promise<{ content: string; error?: string }> {
  try {
    const db = await getDb();
    const keys: any = await db.collection<any>("settings").findOne({}) || {};

    if (options.model === 'gemini-vision' || options.model === 'gemini-pro') {
      return await callGemini(options, keys.geminiApiKey, db);
    } else if (options.model === 'mistral-large') {
      return await callMistral(options, keys.mistralApiKey);
    } else {
      // 'gpt-4o' model key maps to OpenRouter with auto free-model routing
      return await callOpenRouter(options, keys.openrouterApiKey, keys.openrouterModel);
    }
  } catch (error: any) {
    console.error("AI Provider Error:", error);
    return { content: "", error: error.message };
  }
}

/**
 * Call Google Gemini API (text + vision)
 */
async function callGemini(options: AiCallOptions, apiKey?: string | null, db?: Db) {
  if (!apiKey) throw new Error("Gemini API Key is missing in settings.");
  // If db wasn't passed, fetch it ourselves (fallback)
  const database: Db = db || (await getDb());

  const modelName = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const parts: any[] = [{ text: options.prompt }];

  if (options.image) {
    let base64Data = "";
    let mimeType = "image/png";

    if (options.image.startsWith("data:")) {
      // Already a base64 data URL — extract directly
      const match = options.image.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    } else if (options.image.includes("/api/media/")) {
      // Internal MongoDB media URL — read the binary directly from the DB
      // to avoid a fragile HTTP round-trip that may return HTML on the server.
      const mediaId = options.image.split("/api/media/").pop()?.split("?")[0];
      if (mediaId) {
        const mediaDoc = await database.collection<any>("media").findOne({ _id: mediaId });
        if (mediaDoc?.content) {
          const buf = mediaDoc.content.buffer
            ? Buffer.from(mediaDoc.content.buffer)
            : Buffer.from(mediaDoc.content);
          base64Data = buf.toString("base64");
          mimeType = mediaDoc.mimeType || "image/png";
        }
      }
    } else if (options.image.startsWith("http") || options.image.startsWith("/")) {
      // External or relative URL — fetch with a reliable base URL
      const baseUrl =
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
      const fullUrl = options.image.startsWith("/") ? `${baseUrl}${options.image}` : options.image;
      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
      const contentType = res.headers.get("Content-Type") || "";
      if (contentType.includes("text/html")) {
        throw new Error(`Image URL returned HTML instead of an image. Check the URL is correct.`);
      }
      const buffer = await res.arrayBuffer();
      base64Data = Buffer.from(buffer).toString("base64");
      mimeType = contentType || "image/png";
    }

    if (base64Data) {
      parts.push({ inline_data: { mime_type: mimeType, data: base64Data } });
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return { content: data.candidates?.[0]?.content?.parts?.[0]?.text || "" };
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
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: options.prompt }],
      max_tokens: 1024,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return { content: data.choices?.[0]?.message?.content || "" };
}

/**
 * Call OpenRouter API using the free auto-router (`openrouter/auto`).
 *
 * `openrouter/auto` is OpenRouter's smart free router — it selects the best
 * available free model for your request automatically, supporting text,
 * vision, tool calling, and structured outputs as needed.
 *
 * If the user has configured a custom OpenRouter model in Settings, that
 * model is used instead (allows power users to pin a specific model).
 *
 * max_tokens is capped at 800 to stay well within free-tier limits.
 */
async function callOpenRouter(
  options: AiCallOptions,
  apiKey?: string | null,
  customModel?: string | null
) {
  if (!apiKey) throw new Error("OpenRouter API Key is missing in settings.");

  // Use the user's custom model if set and not the legacy default,
  // otherwise fall back to the free auto-router.
  const isLegacyDefault = !customModel || customModel === "openai/gpt-4o";
  const model = isLegacyDefault ? "openrouter/auto" : customModel;

  const body: any = {
    model,
    messages: [{ role: "user", content: options.prompt }],
    max_tokens: 800, // Stay within free tier limits
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://novaxfolio.vercel.app",
      "X-Title": "NovaxFolio",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  return { content: data.choices?.[0]?.message?.content || "" };
}