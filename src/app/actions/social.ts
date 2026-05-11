"use server";

import { db } from "@/lib/db";
import { socialLinks } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSocialLinks() {
  try {
    const links = await db.select().from(socialLinks);
    return links;
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    return [];
  }
}

export async function createSocialLink(formData: FormData) {
  try {
    const platform = formData.get("platform") as string;
    const url = formData.get("url") as string;
    const icon = formData.get("icon") as string;

    await db.insert(socialLinks).values({
      platform, url, icon
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to create social link:", error);
    return { success: false };
  }
}

export async function deleteSocialLink(id: string) {
  try {
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete social link:", error);
    return { success: false };
  }
}
