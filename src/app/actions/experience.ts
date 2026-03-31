"use server";
import { db } from "@/lib/db";
import { experiences } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches all professional experience records from the database.
 * Used for the timeline display on the public site and admin list.
 */
export async function getExperiences() {
  try {
    return await db.select().from(experiences);
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return [];
  }
}


export async function createExperience(formData: FormData) {
  try {
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const period = formData.get("period") as string;
    const description = formData.get("description") as string;
    const achievementsRaw = formData.get("achievements") as string;
    const achievements = achievementsRaw.split("\n").map((a) => a.trim()).filter(Boolean);
    await db.insert(experiences).values({ role, company, period, description, achievements });
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch { return { success: false }; }
}

export async function deleteExperience(id: string) {
  try {
    await db.delete(experiences).where(eq(experiences.id, id));
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch { return { success: false }; }
}
