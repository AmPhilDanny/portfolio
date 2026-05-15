"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches the 'About' section data from the database.
 * Returns the first record or null if the collection is empty.
 */
export async function getAbout() {
  try {
    const db = await getDb();
    const about = await db.collection("abouts").findOne({});
    if (about) {
      return { ...about, id: about._id.toString() };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch about:", error);
    return null;
  }
}

export async function updateAbout(formData: FormData) {
  try {
    const description = formData.get("description") as string;
    const statsStr = formData.get("stats") as string;
    const featuresStr = formData.get("features") as string;

    const stats = statsStr ? JSON.parse(statsStr) : null;
    const features = featuresStr ? JSON.parse(featuresStr) : null;
    
    const db = await getDb();
    const existing = await db.collection("abouts").findOne({});

    const payload = {
      description,
      stats,
      features,
      updatedAt: new Date()
    };

    if (existing) {
      await db.collection("abouts").updateOne(
        { _id: existing._id },
        { $set: payload }
      );
    } else {
      await db.collection("abouts").insertOne({
        ...payload,
        _id: crypto.randomUUID()
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (error) {
    console.error("Failed to update about:", error);
    return { success: false, error: "Failed to update about details." };
  }
}
