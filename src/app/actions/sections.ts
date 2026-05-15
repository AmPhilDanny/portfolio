"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSectionConfigs() {
  try {
    const db = await getDb();
    const configs = await db.collection("section_configs").find({}).toArray();
    return configs.map(c => ({ ...c, id: c._id.toString() }));
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

    const db = await getDb();
    await db.collection("section_configs").updateOne(
      { sectionId: sectionId },
      { 
        $set: { title, description, updatedAt: new Date() },
        $setOnInsert: { _id: crypto.randomUUID() } 
      },
      { upsert: true }
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update section config:", error);
    return { success: false };
  }
}
