"use server";

import { db } from "@/lib/db";
import { 
  socialMediaInsights, socialPlatformMetrics, 
  contentCalendar, aiConfig, settings
} from "@/lib/schema";
import { callAi } from "@/lib/ai-provider";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type AiModel = 'gemini-vision' | 'gemini-pro' | 'mistral-large' | 'gpt-4o';

/**
 * Resolve the AI model to use, with priority:
 * explicit (from UI) > per-platform config > global settings > hardcoded default
 */
async function resolveModel(
  explicit: AiModel | undefined,
  platform: string,
  fallback: AiModel
): Promise<AiModel> {
  if (explicit) return explicit;
  // Try per-platform config
  const config = await db.select().from(aiConfig).where(eq(aiConfig.platform, platform)).limit(1);
  const platformModel = config[0]?.preferredModel as AiModel | null;
  if (platformModel) return platformModel;
  // Try global settings
  const globalConfig = await db.select().from(settings).limit(1);
  const globalModel = globalConfig[0]?.globalAiModel as AiModel | null;
  if (globalModel) return globalModel;
  return fallback;
}

/**
 * Track a growth metric for a platform
 */
export async function trackGrowthMetric(platform: string, type: string, value: string) {
  try {
    await db.insert(socialPlatformMetrics).values({
      platform,
      metricType: type,
      value,
    });
    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Analyze a social media profile screenshot.
 * @param model - Optional: 'gemini-vision' or 'gpt-4o'. Mistral is excluded (no vision).
 */
export async function analyzeScreenshot(
  platform: string,
  imageUrl: string,
  model?: AiModel
) {
  try {
    // Vision analysis only works with Gemini or GPT-4o
    const visionModel = model === 'gpt-4o' ? 'gpt-4o' : 'gemini-vision';

    const response = await callAi({
      model: visionModel,
      prompt: `Analyze this screenshot of a ${platform} profile. 
      Extract the following:
      - handle
      - follower count
      - following count
      - engagement rate
      - identity: the core brand voice/vibe (e.g. "Minimalist & Sophisticated", "Hacker Spirit")
      - content_pillars: array of 3-5 key topics they post about
      - summary: brief strategic growth advice
      
      Return as valid JSON.`,
      image: imageUrl
    });

    if (response.error) throw new Error(response.error);

    let data: any = {};
    try {
      const cleaned = response.content.replace(/```json\n?|\n?```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      data = { summary: response.content };
    }

    // Robustness checks
    const finalIdentity = typeof data.identity === 'object' && data.identity !== null
      ? JSON.stringify(data.identity)
      : String(data.identity || "");
      
    const finalPillars = Array.isArray(data.content_pillars) 
      ? data.content_pillars 
      : (data.content_pillars ? [String(data.content_pillars)] : []);

    // Save insight to DB
    await db.insert(socialMediaInsights).values({
      platform,
      handle: String(data.handle || ""),
      followerCount: String(data.followers || ""),
      followingCount: String(data.following || ""),
      engagementRate: String(data.engagement_rate || ""),
      identity: finalIdentity,
      contentPillars: finalPillars,
      analysisSummary: data.summary || response.content,
      screenshotUrl: imageUrl,
      rawAiResponse: response.content
    });

    await trackGrowthMetric(platform, 'followers', String(data.followers || "0"));

    revalidatePath("/admin/social-ai");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Generate a new social media post.
 * @param model - Optional model to use; falls back to platform config then global settings.
 * @param customContext - Optional extra context (e.g. Project title/desc) to base the post on.
 */
export async function generateSocialPost(
  platform: string, 
  topic?: string, 
  model?: AiModel,
  customContext?: string
) {
  try {
    // 1. Get platform config
    const config = await db.select().from(aiConfig).where(eq(aiConfig.platform, platform)).limit(1);
    const brandVoice = config[0]?.brandVoice || "Professional and engaging";
    const targetAudience = config[0]?.targetAudience || "General tech audience";
    const goals = config[0]?.growthGoals || "Increase reach and engagement";

    // 2. Get latest insights for context
    const insights = await db.select()
      .from(socialMediaInsights)
      .where(eq(socialMediaInsights.platform, platform))
      .orderBy(desc(socialMediaInsights.lastAnalyzed))
      .limit(1);

    const brandContext = insights[0] 
      ? `Identity: ${insights[0].identity || "N/A"}
         Content Pillars: ${Array.isArray(insights[0].contentPillars) ? (insights[0].contentPillars as string[]).join(", ") : "N/A"}
         Growth Summary: ${insights[0].analysisSummary}` 
      : "No previous analysis available.";

    // 3. Resolve model
    const resolvedModel = await resolveModel(model, platform, 'mistral-large');

    // 4. Determine platform-specific constraints
    const platformLimits: Record<string, string> = {
      'X': 'strictly under 280 characters',
      'Twitter': 'strictly under 280 characters',
      'LinkedIn': 'between 150-300 words with bullet points',
      'Facebook': 'long-form and engaging with a clear CTA',
      'Instagram': 'under 2000 characters with 5-10 hashtags'
    };
    const limit = platformLimits[platform] || 'engaging and professionally sized';

    // 5. Call AI
    const response = await callAi({
      model: resolvedModel,
      prompt: `Act as a Social Media Strategist for ${platform}. 
      
      Brand Voice: ${brandVoice}
      Target Audience: ${targetAudience}
      Growth Goals: ${goals}
      Brand Context: ${brandContext}
      
      ${customContext ? `Primary Content Source: ${customContext}` : ""}
      Topic/Request: ${topic || "Recent achievements in Data Analysis and Web Development"}
      
      Requirements:
      1. Length: ${limit}. You MUST provide a complete, high-value post that utilizes the maximum space allowed for the platform while remaining concise.
      2. Style: High-impact, engaging, and professional.
      3. Format: Use Markdown for formatting (e.g. **bold**, *italics*, bullet points, and proper spacing).
      4. Strategy: Include a soft call-to-action and relevant hashtags.
      
      Return ONLY the final post content. Do not include any meta-talk or JSON wrapper.`
    });

    if (response.error) throw new Error(response.error);

    // 5. Save to content calendar
    await db.insert(contentCalendar).values({
      platform,
      content: response.content,
      status: 'draft',
      suggestedPostDate: new Date()
    });

    revalidatePath("/admin/social-ai");
    return { success: true, content: response.content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update AI Configuration for a platform
 */
export async function updateAiConfig(data: {
  platform: string;
  brandVoice: string;
  targetAudience: string;
  preferredModel: string;
  growthGoals: string;
  profileUrl?: string;
}) {
  try {
    const existing = await db.select().from(aiConfig).where(eq(aiConfig.platform, data.platform)).limit(1);
    
    if (existing.length > 0) {
      const { platform, ...updateData } = data;
      await db.update(aiConfig).set(updateData).where(eq(aiConfig.platform, platform));
    } else {
      await db.insert(aiConfig).values(data);
    }

    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetch AI Configuration for a platform
 */
export async function getAiConfig(platform: string) {
  try {
    const config = await db.select().from(aiConfig).where(eq(aiConfig.platform, platform)).limit(1);
    return config[0] || null;
  } catch (error) {
    console.error("Failed to fetch AI config:", error);
    return null;
  }
}

/**
 * Analyze a social media profile by fetching its public URL.
 * Works best with GitHub, LinkedIn public pages. JS-heavy sites (Instagram, X)
 * may return limited content — combine with screenshot analysis for best results.
 */
export async function analyzeProfileUrl(
  platform: string,
  profileUrl: string,
  model?: AiModel
) {
  try {
    // Fetch the page HTML server-side
    const res = await fetch(profileUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NovaxFolioBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Failed to fetch ${profileUrl} (status ${res.status})`);

    const html = await res.text();

    // Strip HTML tags and collapse whitespace to get readable text
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 6000); // Keep within token budget

    const resolvedModel = await resolveModel(model, platform, 'gemini-pro');

    const response = await callAi({
      model: resolvedModel,
      prompt: `You are an elite Social Media Analyst. Analyze this public ${platform} profile data for a professional brand.

Page content (extracted text from ${profileUrl}):
---
${text}
---

Extract the following as a structured JSON object:
- handle: The username or professional display name.
- followers: Total followers/subscribers (e.g., "1.2k", "500").
- following: Total accounts followed.
- engagement_rate: An estimated engagement level based on visible activity (e.g., "High", "3.2%", "N/A").
- bio: A concise summary of their professional identity.
- identity: The core "Brand Voice" detected (e.g., "Sarcastic & Technical", "Visionary", "Educational").
- content_pillars: Key topics they frequently post about.
- summary: A 2-3 sentence strategic insight on their growth and specific recommendations for improvement.

Return ONLY valid JSON.`,
    });

    if (response.error) throw new Error(response.error);

    let data: any = {};
    try {
      const cleaned = response.content.replace(/```json\n?|\n?```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      data = { summary: response.content };
    }

    // Ensure identity is a string and contentPillars is an array (robustness)
    const finalIdentity = typeof data.identity === 'object' && data.identity !== null
      ? JSON.stringify(data.identity)
      : String(data.identity || "");
      
    const finalPillars = Array.isArray(data.content_pillars) 
      ? data.content_pillars 
      : (data.content_pillars ? [String(data.content_pillars)] : []);

    // Save to DB
    await db.insert(socialMediaInsights).values({
      platform,
      handle: String(data.handle || ""),
      followerCount: String(data.followers || ""),
      followingCount: String(data.following || ""),
      engagementRate: String(data.engagement_rate || ""),
      identity: finalIdentity,
      contentPillars: finalPillars,
      analysisSummary: data.summary || response.content,
      screenshotUrl: null,
      rawAiResponse: response.content,
    });

    if (data.followers) await trackGrowthMetric(platform, 'followers', String(data.followers));

    revalidatePath("/admin/social-ai");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetch recent social media insights for a platform
 */
export async function getSocialInsights(platform: string) {
  try {
    return await db.select()
      .from(socialMediaInsights)
      .where(eq(socialMediaInsights.platform, platform))
      .orderBy(desc(socialMediaInsights.lastAnalyzed))
      .limit(5);
  } catch (error) {
    console.error("Failed to fetch insights:", error);
    return [];
  }
}

/**
 * Fetch drafts from the content calendar for a platform
 */
export async function getContentDrafts(platform: string) {
  try {
    return await db.select()
      .from(contentCalendar)
      .where(eq(contentCalendar.platform, platform))
      .orderBy(desc(contentCalendar.createdAt))
      .limit(10);
  } catch (error) {
    console.error("Failed to fetch drafts:", error);
    return [];
  }
}
