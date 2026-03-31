"use server";

import { db } from "@/lib/db";
import { abouts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches the 'About' section data from the database.
 * Returns the first record or null if the table is empty.
 */
export async function getAbout() {
  try {
    const about = await db.select().from(abouts).limit(1);
    return about.length > 0 ? about[0] : null;
  } catch (error) {
    console.error("Failed to fetch about:", error);
    return null;
  }
}


export async function updateAbout(formData: FormData) {
  try {
    const description = formData.get("description") as string;
    
    const existing = await getAbout();

    if (existing) {
      await db.update(abouts)
        .set({ description })
        .where(eq(abouts.id, existing.id));
    } else {
      await db.insert(abouts).values({
        description
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
