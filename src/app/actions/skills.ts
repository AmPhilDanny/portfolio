"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches all technical skill categories and their associated skills.
 */
export async function getSkillCategories() {
  try {
    const db = await getDb();
    const categories = await db.collection<any>("skill_categories").find({}).toArray();
    return categories.map(c => ({ ...c, id: c._id.toString() }));
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return [];
  }
}

export async function createSkillCategory(formData: FormData) {
  try {
    const category = formData.get("category") as string;
    const skillsRaw = formData.get("skills") as string;
    const skills = skillsRaw.split(",").map((s) => s.trim()).filter(Boolean);

    const db = await getDb();
    await db.collection<any>("skill_categories").insertOne({
      _id: crypto.randomUUID(),
      category,
      skills,
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch { return { success: false }; }
}

export async function deleteSkillCategory(id: string) {
  try {
    const db = await getDb();
    await db.collection<any>("skill_categories").deleteOne({ _id: id });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch { return { success: false }; }
}

export async function updateSkillCategory(id: string, formData: FormData) {
  try {
    const category = formData.get("category") as string;
    const skillsRaw = formData.get("skills") as string;
    const skills = skillsRaw.split(",").map((s) => s.trim()).filter(Boolean);

    const db = await getDb();
    await db.collection<any>("skill_categories").updateOne(
      { _id: id },
      {
        $set: {
          category,
          skills,
          updatedAt: new Date()
        }
      }
    );

    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch { return { success: false }; }
}
