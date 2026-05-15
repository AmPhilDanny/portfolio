"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const db = await getDb();
    const projects = await db.collection("projects").find({}).toArray();
    return projects.map(p => ({ ...p, id: p._id.toString() }));
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
    const projectFileUrl = formData.get("projectFileUrl") as string;

    const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];

    const db = await getDb();
    await db.collection("projects").insertOne({
      _id: crypto.randomUUID(),
      title,
      description,
      image,
      tags,
      githubUrl,
      liveUrl,
      projectFileUrl,
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project." };
  }
}

export async function deleteProject(id: string) {
  try {
    const db = await getDb();
    await db.collection("projects").deleteOne({ _id: id });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project." };
  }
}
