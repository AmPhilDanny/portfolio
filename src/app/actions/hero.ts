"use server";

import { db } from "@/lib/db";
import { heroes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches the current hero section data from the database.
 * Returns the first row or null if the table is empty.
 */
export async function getHero() {
  try {
    const hero = await db.select().from(heroes).limit(1);
    return hero.length > 0 ? hero[0] : null;
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

    const existing = await getHero();

    if (existing) {
      await db.update(heroes)
        .set({ name, title, description, cvUrl, imageUrl })
        .where(eq(heroes.id, existing.id));
    } else {
      await db.insert(heroes).values({
        name, title, description, cvUrl, imageUrl
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
