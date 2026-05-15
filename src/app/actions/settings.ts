"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches the global application settings from the database.
 */
export async function getSettings() {
  try {
    const db = await getDb();
    const res = await db.collection("settings").findOne({});
    if (res) {
      return { ...res, id: res._id.toString() };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null; 
  }
}

export async function updateSettings(formData: FormData) {
  try {
    const values = {
      siteName: formData.get("siteName") as string,
      showSiteName: formData.get("showSiteName") === "on" ? "true" : "false",
      logoUrl: formData.get("logoUrl") as string,
      faviconUrl: formData.get("faviconUrl") as string,
      copyrightText: formData.get("copyrightText") as string,
      githubUrl: formData.get("githubUrl") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
      twitterUrl: formData.get("twitterUrl") as string,
      facebookUrl: formData.get("facebookUrl") as string,
      instagramUrl: formData.get("instagramUrl") as string,
      email: formData.get("email") as string,
      primaryColor: formData.get("primaryColor") as string,
      secondaryColor: formData.get("secondaryColor") as string,
      backgroundColor: formData.get("backgroundColor") as string,
      accentColor: formData.get("accentColor") as string,
      fontFamily: formData.get("fontFamily") as string,
      customCss: formData.get("customCss") as string,
      geminiApiKey: formData.get("geminiApiKey") as string,
      mistralApiKey: formData.get("mistralApiKey") as string,
      openrouterApiKey: formData.get("openrouterApiKey") as string,
      openrouterModel: formData.get("openrouterModel") as string,
      globalAiModel: formData.get("globalAiModel") as string,
      updatedAt: new Date()
    };
    
    const db = await getDb();
    const existing = await db.collection("settings").findOne({});

    if(existing) {
      await db.collection("settings").updateOne(
        { _id: existing._id },
        { $set: values }
      );
    } else {
      await db.collection("settings").insertOne({
        ...values,
        _id: crypto.randomUUID()
      });
    }
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch(e) { 
    console.error("Failed to update settings:", e);
    return { success: false, error: "Failed to update settings" }; 
  }
}

export async function updateAiApiKeys(data: {
  geminiApiKey?: string;
  mistralApiKey?: string;
  openrouterApiKey?: string;
}) {
  try {
    const db = await getDb();
    const existing = await db.collection("settings").findOne({});
    
    if (existing) {
      await db.collection("settings").updateOne(
        { _id: existing._id },
        { $set: { ...data, updatedAt: new Date() } }
      );
    } else {
      await db.collection("settings").insertOne({
        ...data,
        _id: crypto.randomUUID(),
        updatedAt: new Date()
      });
    }
    revalidatePath("/admin/social-ai");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update AI keys:", error);
    return { success: false, error: error.message };
  }
}
