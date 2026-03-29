"use server";
import { db } from "@/lib/db";
import { certifications } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCertifications() {
  try {
    return await db.select().from(certifications);
  } catch (error) {
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

    await db.insert(certifications).values({
      name, issuer, date, description, link, imageUrl
    });

    revalidatePath("/");
    revalidatePath("/admin/certifications");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create certification." };
  }
}

export async function deleteCertification(id: string) {
  try {
    await db.delete(certifications).where(eq(certifications.id, id));
    revalidatePath("/");
    revalidatePath("/admin/certifications");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete certification." };
  }
}
