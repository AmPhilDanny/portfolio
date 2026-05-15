"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches all certification records from the database.
 */
export async function getCertifications() {
  try {
    const db = await getDb();
    const certifications = await db.collection<any>("certifications").find({}).toArray();
    return certifications.map(c => ({ ...c, id: c._id.toString() }));
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return [];
  }
}

export async function createCertification(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const issuer = formData.get("issuer") as string;
    const date = formData.get("date") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const db = await getDb();
    await db.collection<any>("certifications").insertOne({
      _id: crypto.randomUUID(),
      name,
      issuer,
      date,
      description,
      link,
      imageUrl,
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin/certifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to create certification:", error);
    return { success: false, error: "Failed to create certification." };
  }
}

export async function deleteCertification(id: string) {
  try {
    const db = await getDb();
    await db.collection<any>("certifications").deleteOne({ _id: id });
    revalidatePath("/");
    revalidatePath("/admin/certifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete certification:", error);
    return { success: false, error: "Failed to delete certification." };
  }
}
