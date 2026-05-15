"use server";

import { getDb } from "@/lib/db";
import { callAi } from "@/lib/ai-provider";
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
  
  const db = await getDb();
  
  // Try per-platform config
  const config = await db.collection<any>("ai_config").findOne({ platform });
  const platformModel = config?.preferredModel as AiModel | null;
  if (platformModel) return platformModel;
  
  // Try global settings
  const globalConfig = await db.collection<any>("settings").findOne({});
  const globalModel = globalConfig?.globalAiModel as AiModel | null;
  if (globalModel) return globalModel;
  
  return fallback;
}

/**
 * Track a growth metric for a platform
 */
export async function trackGrowthMetric(platform: string, type: string, value: string) {
  try {
    const db = await getDb();
    await db.collection<any>("social_platform_metrics").insertOne({
      _id: crypto.randomUUID(),
      platform,
      metricType: type,
      value,
      recordedAt: new Date()
    });
    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to track metric:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Analyze a social media profile screenshot.
 */
export async function analyzeScreenshot(
  platform: string,
  imageUrl: string,
  model?: AiModel
) {
  try {
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

    const finalIdentity = typeof data.identity === 'object' && data.identity !== null
      ? JSON.stringify(data.identity)
      : String(data.identity || "");
      
    const finalPillars = Array.isArray(data.content_pillars) 
      ? data.content_pillars 
      : (data.content_pillars ? [String(data.content_pillars)] : []);

    const db = await getDb();
    await db.collection<any>("social_media_insights").insertOne({
      _id: crypto.randomUUID(),
      platform,
      handle: String(data.handle || ""),
      followerCount: String(data.followers || ""),
      followingCount: String(data.following || ""),
      engagementRate: String(data.engagement_rate || ""),
      identity: finalIdentity,
      contentPillars: finalPillars,
      analysisSummary: data.summary || response.content,
      screenshotUrl: imageUrl,
      rawAiResponse: response.content,
      lastAnalyzed: new Date()
    });

    await trackGrowthMetric(platform, 'followers', String(data.followers || "0"));

    revalidatePath("/admin/social-ai");
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to analyze screenshot:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate a new social media post.
 */
export async function generateSocialPost(
  platform: string, 
  topic?: string, 
  model?: AiModel,
  customContext?: string
) {
  try {
    const db = await getDb();
    
    // 1. Get platform config
    const config = await db.collection<any>("ai_config").findOne({ platform });
    const brandVoice = config?.brandVoice || "Professional and engaging";
    const targetAudience = config?.targetAudience || "General tech audience";
    const goals = config?.growthGoals || "Increase reach and engagement";

    // 2. Get latest insights for context
    const insight = await db.collection<any>("social_media_insights")
      .find({ platform })
      .sort({ lastAnalyzed: -1 })
      .limit(1)
      .next();

    const brandContext = insight 
      ? `Identity: ${insight.identity || "N/A"}
         Content Pillars: ${Array.isArray(insight.contentPillars) ? insight.contentPillars.join(", ") : "N/A"}
         Growth Summary: ${insight.analysisSummary}` 
      : "No previous analysis available.";

    const resolvedModel = await resolveModel(model, platform, 'mistral-large');

    const platformLimits: Record<string, string> = {
      'X': 'strictly under 280 characters',
      'Twitter': 'strictly under 280 characters',
      'LinkedIn': 'between 150-300 words with bullet points',
      'Facebook': 'long-form and engaging with a clear CTA',
      'Instagram': 'under 2000 characters with 5-10 hashtags'
    };
    const limit = platformLimits[platform] || 'engaging and professionally sized';

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

    await db.collection<any>("content_calendar").insertOne({
      _id: crypto.randomUUID(),
      platform,
      content: response.content,
      status: 'draft',
      suggestedPostDate: new Date(),
      createdAt: new Date()
    });

    revalidatePath("/admin/social-ai");
    return { success: true, content: response.content };
  } catch (error: any) {
    console.error("Failed to generate post:", error);
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
    const db = await getDb();
    const { platform, ...updateData } = data;
    
    await db.collection<any>("ai_config").updateOne(
      { platform: platform },
      { 
        $set: { ...updateData, updatedAt: new Date() },
        $setOnInsert: { _id: crypto.randomUUID() }
      },
      { upsert: true }
    );

    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update AI config:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch AI Configuration for a platform
 */
export async function getAiConfig(platform: string) {
  try {
    const db = await getDb();
    const config = await db.collection<any>("ai_config").findOne({ platform });
    if (config) {
      return { ...config, id: config._id.toString() };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch AI config:", error);
    return null;
  }
}

/**
 * Analyze a social media profile by fetching its public URL.
 */
export async function analyzeProfileUrl(
  platform: string,
  profileUrl: string,
  model?: AiModel
) {
  try {
    const res = await fetch(profileUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NovaxFolioBot/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Failed to fetch ${profileUrl} (status ${res.status})`);

    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 6000);

    const resolvedModel = await resolveModel(model, platform, 'gemini-pro');

    const response = await callAi({
      model: resolvedModel,
      prompt: `You are an elite Social Media Analyst. Analyze this public ${platform} profile data for a professional brand.
      Page content: ${text}
      Extract: handle, followers, following, engagement_rate, bio, identity, content_pillars, summary.
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

    const finalIdentity = typeof data.identity === 'object' && data.identity !== null
      ? JSON.stringify(data.identity)
      : String(data.identity || "");
      
    const finalPillars = Array.isArray(data.content_pillars) 
      ? data.content_pillars 
      : (data.content_pillars ? [String(data.content_pillars)] : []);

    const db = await getDb();
    await db.collection<any>("social_media_insights").insertOne({
      _id: crypto.randomUUID(),
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
      lastAnalyzed: new Date()
    });

    if (data.followers) await trackGrowthMetric(platform, 'followers', String(data.followers));

    revalidatePath("/admin/social-ai");
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to analyze URL:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch recent social media insights for a platform
 */
export async function getSocialInsights(platform: string) {
  try {
    const db = await getDb();
    const insights = await db.collection<any>("social_media_insights")
      .find({ platform })
      .sort({ lastAnalyzed: -1 })
      .limit(5)
      .toArray();
    return insights.map(i => ({ ...i, id: i._id.toString() }));
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
    const db = await getDb();
    const drafts = await db.collection<any>("content_calendar")
      .find({ platform })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    return drafts.map(d => ({ ...d, id: d._id.toString() }));
  } catch (error) {
    console.error("Failed to fetch drafts:", error);
    return [];
  }
}
