"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches all service offerings from the database.
 */
export async function getServices() {
  try {
    const db = await getDb();
    const services = await db.collection<any>("services").find({}).toArray();
    return services.map(s => ({ ...s, id: s._id.toString() }));
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
    
    const db = await getDb();
    await db.collection<any>("services").insertOne({
      _id: crypto.randomUUID(),
      title,
      description,
      icon,
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch { return { success: false }; }
}

export async function deleteService(id: string) {
  try {
    const db = await getDb();
    await db.collection<any>("services").deleteOne({ _id: id });
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch { return { success: false }; }
}

export async function updateService(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    
    const db = await getDb();
    await db.collection("services").updateOne(
      { _id: id },
      { $set: { title, description, icon, updatedAt: new Date() } }
    );
      
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) { 
    console.error("Failed to update service:", error);
    return { success: false }; 
  }
}
