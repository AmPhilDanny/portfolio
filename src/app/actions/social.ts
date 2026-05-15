"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSocialLinks() {
  try {
    const db = await getDb();
    const links = await db.collection("social_links").find({}).toArray();
    return links.map(l => ({ ...l, id: l._id.toString() }));
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

    const db = await getDb();
    await db.collection("social_links").insertOne({
      _id: crypto.randomUUID(),
      platform,
      url,
      icon,
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create social link:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSocialLink(id: string, formData: FormData) {
  try {
    const platform = formData.get("platform") as string;
    const url = formData.get("url") as string;
    const icon = formData.get("icon") as string;

    const db = await getDb();
    await db.collection("social_links").updateOne(
      { _id: id },
      { $set: { platform, url, icon, updatedAt: new Date() } }
    );

    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update social link:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSocialLink(id: string) {
  try {
    const db = await getDb();
    await db.collection("social_links").deleteOne({ _id: id });
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete social link:", error);
    return { success: false };
  }
}
