"use server";

import { db } from "@/lib/db";
import { projects } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    return await db.select().from(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const tagsString = formData.get("tags") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const liveUrl = formData.get("liveUrl") as string;

    const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];

    await db.insert(projects).values({
      title, description, image, tags, githubUrl, liveUrl
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create project." };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete project." };
  }
}
