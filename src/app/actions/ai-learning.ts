"use server";

import { db } from "@/lib/db";
import { 
  socialMediaInsights, socialPlatformMetrics, 
  contentCalendar, aiConfig 
} from "@/lib/schema";
import { callAi } from "@/lib/ai-provider";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
 * Analyze a social media profile screenshot
 */
export async function analyzeScreenshot(platform: string, imageUrl: string) {
  try {
    const response = await callAi({
      model: 'gemini-vision',
      prompt: `Analyze this screenshot of a ${platform} profile. Extract the handle, follower count, following count, and engagement trends. Return the data in JSON format.`,
      image: imageUrl
    });

    if (response.error) throw new Error(response.error);

    const data = JSON.parse(response.content);

    // Save insight to DB
    await db.insert(socialMediaInsights).values({
      platform,
      handle: data.handle,
      followerCount: data.followers,
      followingCount: data.following,
      engagementRate: data.engagement_rate,
      analysisSummary: data.summary,
      screenshotUrl: imageUrl,
      rawAiResponse: response.content
    });

    // Also track the follower count as a metric
    await trackGrowthMetric(platform, 'followers', data.followers);

    revalidatePath("/admin/social-ai");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Generate a new social media post
 */
export async function generateSocialPost(platform: string, topic?: string) {
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

    // 3. Call AI
    const response = await callAi({
      model: 'mistral-large',
      prompt: `Act as a Social Media Strategist for ${platform}. 
      Brand Voice: ${brandVoice}
      Growth Goals: ${goals}
      Context: ${context}
      Topic: ${topic || "Recent achievements in Data Analysis and Web Development"}
      
      Generate a high-impact post with relevant hashtags. Return only the post content.`
    });

    if (response.error) throw new Error(response.error);

    // 4. Save to content calendar
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
