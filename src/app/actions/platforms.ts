"use server";

import { db } from "@/lib/db";
import { aiConfig, socialMediaInsights } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Get all configured platforms for AI
 */
export async function getAiPlatforms() {
  try {
    const platforms = await db.select().from(aiConfig);
    return platforms;
  } catch (error) {
    console.error("Failed to fetch AI platforms:", error);
    return [];
  }
}

/**
 * Add a new platform to the AI strategist
 */
export async function addAiPlatform(platform: string) {
  try {
    // Check if already exists
    const existing = await db.select().from(aiConfig).where(eq(aiConfig.platform, platform)).limit(1);
    if (existing.length > 0) return { success: false, error: "Platform already exists" };

    await db.insert(aiConfig).values({
      platform,
      brandVoice: "Professional and Technical",
      targetAudience: "Tech community",
      growthGoals: "Increase visibility and engagement"
    });

    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a platform from the strategist
 */
export async function deleteAiPlatform(id: string) {
  try {
    await db.delete(aiConfig).where(eq(aiConfig.id, id));
    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
