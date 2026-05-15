"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Get all configured platforms for AI
 */
export async function getAiPlatforms() {
  try {
    const db = await getDb();
    const platforms = await db.collection("ai_config").find({}).toArray();
    return platforms.map(p => ({ ...p, id: p._id.toString() }));
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
    const db = await getDb();
    
    // Check if already exists
    const existing = await db.collection("ai_config").findOne({ platform });
    if (existing) return { success: false, error: "Platform already exists" };

    await db.collection("ai_config").insertOne({
      _id: crypto.randomUUID(),
      platform,
      brandVoice: "Professional and Technical",
      targetAudience: "Tech community",
      growthGoals: "Increase visibility and engagement",
      createdAt: new Date()
    });

    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add AI platform:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a platform from the strategist
 */
export async function deleteAiPlatform(id: string) {
  try {
    const db = await getDb();
    await db.collection("ai_config").deleteOne({ _id: id });
    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete AI platform:", error);
    return { success: false, error: error.message };
  }
}
