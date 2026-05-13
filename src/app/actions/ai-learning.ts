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
      prompt: `Analyze this screenshot of a ${platform} profile. Extract the handle, follower count, following count, and engagement trends. Return the data as valid JSON with keys: handle, followers, following, engagement_rate, summary.`,
      image: imageUrl
    });

    if (response.error) throw new Error(response.error);

    let data: any = {};
    try {
      // Strip markdown code fences if present
      const cleaned = response.content.replace(/```json\n?|\n?```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      data = { summary: response.content };
    }

    // Save insight to DB
    await db.insert(socialMediaInsights).values({
      platform,
      handle: data.handle,
      followerCount: String(data.followers || ""),
      followingCount: String(data.following || ""),
      engagementRate: String(data.engagement_rate || ""),
      analysisSummary: data.summary,
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
 */
export async function generateSocialPost(platform: string, topic?: string, model?: AiModel) {
  try {
    // 1. Get platform config
    const config = await db.select().from(aiConfig).where(eq(aiConfig.platform, platform)).limit(1);
    const brandVoice = config[0]?.brandVoice || "Professional and engaging";
    const goals = config[0]?.growthGoals || "Increase reach and engagement";

    // 2. Get latest insights for context
    const insights = await db.select()
      .from(socialMediaInsights)
      .where(eq(socialMediaInsights.platform, platform))
      .orderBy(desc(socialMediaInsights.lastAnalyzed))
      .limit(1);

    const context = insights[0] 
      ? `Last analysis: ${insights[0].analysisSummary}` 
      : "No previous analysis available.";

    // 3. Resolve model
    const resolvedModel = await resolveModel(model, platform, 'mistral-large');

    // 4. Call AI
    const response = await callAi({
      model: resolvedModel,
      prompt: `Act as a Social Media Strategist for ${platform}. 
      Brand Voice: ${brandVoice}
      Growth Goals: ${goals}
      Context: ${context}
      Topic: ${topic || "Recent achievements in Data Analysis and Web Development"}
      
      Generate a high-impact post with relevant hashtags. Return only the post content.`
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
      await db.update(aiConfig).set(data).where(eq(aiConfig.platform, data.platform));
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
      prompt: `You are analyzing the public ${platform} profile page of a developer/creator.

Page content (extracted text from ${profileUrl}):
---
${text}
---

Extract the following as JSON:
- handle: username or display name
- followers: follower/subscriber count (as a string, e.g. "1.2k")
- following: following count (as a string)
- engagement_rate: estimated engagement (if visible)
- bio: short bio or description
- summary: 2–3 sentence growth insights and recommendations

Return only valid JSON.`,
    });

    if (response.error) throw new Error(response.error);

    let data: any = {};
    try {
      const cleaned = response.content.replace(/```json\n?|\n?```/g, "").trim();
      data = JSON.parse(cleaned);
    } catch {
      data = { summary: response.content };
    }

    // Save to DB
    await db.insert(socialMediaInsights).values({
      platform,
      handle: data.handle,
      followerCount: String(data.followers || ""),
      followingCount: String(data.following || ""),
      engagementRate: String(data.engagement_rate || ""),
      analysisSummary: data.summary,
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
