"use server";
import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches all service offerings from the database.
 * Powers the services section on the public site and admin management.
 */
export async function getServices() {
  try {
    return await db.select().from(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}


export async function createService(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    await db.insert(services).values({ title, description, icon });
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch { return { success: false }; }
}

export async function deleteService(id: string) {
  try {
    await db.delete(services).where(eq(services.id, id));
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch { return { success: false }; }
}
