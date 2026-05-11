"use server";

import { db } from "@/lib/db";
import { sectionConfigs } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSectionConfigs() {
  try {
    const configs = await db.select().from(sectionConfigs);
    return configs;
  } catch (error) {
    console.error("Failed to fetch section configs:", error);
    return [];
  }
}

export async function updateSectionConfig(formData: FormData) {
  try {
    const sectionId = formData.get("sectionId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const existing = await db.select().from(sectionConfigs).where(eq(sectionConfigs.sectionId, sectionId)).limit(1);

    if (existing.length > 0) {
      await db.update(sectionConfigs)
        .set({ title, description })
        .where(eq(sectionConfigs.sectionId, sectionId));
    } else {
      await db.insert(sectionConfigs).values({
        sectionId, title, description
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update section config:", error);
    return { success: false };
  }
}
