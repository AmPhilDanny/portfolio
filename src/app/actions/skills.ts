"use server";
import { db } from "@/lib/db";
import { skillCategories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSkillCategories() {
  try {
    return await db.select().from(skillCategories);
  } catch { return []; }
}

export async function createSkillCategory(formData: FormData) {
  try {
    const category = formData.get("category") as string;
    const skillsRaw = formData.get("skills") as string;
    const skills = skillsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    await db.insert(skillCategories).values({ category, skills });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch { return { success: false }; }
}

export async function deleteSkillCategory(id: string) {
  try {
    await db.delete(skillCategories).where(eq(skillCategories.id, id));
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch { return { success: false }; }
}
