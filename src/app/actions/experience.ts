"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches all professional experience records from the database.
 */
export async function getExperiences() {
  try {
    const db = await getDb();
    const experiences = await db.collection("experiences").find({}).toArray();
    return experiences.map(e => ({ ...e, id: e._id.toString() }));
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

    const db = await getDb();
    await db.collection("experiences").insertOne({
      _id: crypto.randomUUID(),
      role,
      company,
      period,
      description,
      achievements,
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch { return { success: false }; }
}

export async function deleteExperience(id: string) {
  try {
    const db = await getDb();
    await db.collection("experiences").deleteOne({ _id: id });
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch { return { success: false }; }
}

export async function updateExperience(id: string, formData: FormData) {
  try {
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const period = formData.get("period") as string;
    const description = formData.get("description") as string;
    const achievementsRaw = formData.get("achievements") as string;
    const achievements = achievementsRaw.split("\n").map((a) => a.trim()).filter(Boolean);
    
    const db = await getDb();
    await db.collection("experiences").updateOne(
      { _id: id },
      { $set: { role, company, period, description, achievements, updatedAt: new Date() } }
    );
      
    revalidatePath("/");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (error) { 
    console.error("Failed to update experience:", error);
    return { success: false }; 
  }
}
