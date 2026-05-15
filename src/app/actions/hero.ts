"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches the current hero section data from the database.
 * Returns the first row or null if the collection is empty.
 */
export async function getHero() {
  try {
    const db = await getDb();
    const hero = await db.collection<any>("heroes").findOne({});
    if (hero) {
      return { ...hero, id: hero._id.toString() };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch hero:", error);
    return null;
  }
}

/**
 * Updates or creates the hero section data based on form submissions.
 * Revalidates the home page and admin dashboard to reflect changes instantly.
 */
export async function updateHero(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const cvUrl = formData.get("cvUrl") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const badgeText = formData.get("badgeText") as string;

    const db = await getDb();
    const hero = await db.collection<any>("heroes").findOne({});

    const payload = {
      name,
      title,
      description,
      badgeText,
      cvUrl,
      imageUrl,
      updatedAt: new Date()
    };

    if (hero) {
      await db.collection("heroes").updateOne(
        { _id: hero._id },
        { $set: payload }
      );
    } else {
      await db.collection("heroes").insertOne({
        ...payload,
        _id: crypto.randomUUID() // Keep using UUIDs as strings for consistency
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/hero");
    return { success: true };
  } catch (error) {
    console.error("Failed to update hero:", error);
    return { success: false, error: "Failed to update hero details." };
  }
}
