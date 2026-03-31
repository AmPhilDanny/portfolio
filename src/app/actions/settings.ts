"use server";
import { db } from "@/lib/db";
import { settings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches the global application settings from the database.
 * These settings control branding, colors, social links, and custom CSS.
 */
export async function getSettings() {
  try {
    const res = await db.select().from(settings).limit(1);
    return res.length > 0 ? res[0] : null;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null; 
  }
}


export async function updateSettings(formData: FormData) {
  try {
    const siteName = formData.get("siteName") as string;
    const showSiteName = formData.get("showSiteName") === "on" ? "true" : "false";
    const logoUrl = formData.get("logoUrl") as string;
    const faviconUrl = formData.get("faviconUrl") as string;
    const copyrightText = formData.get("copyrightText") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const twitterUrl = formData.get("twitterUrl") as string;
    const facebookUrl = formData.get("facebookUrl") as string;
    const instagramUrl = formData.get("instagramUrl") as string;
    const email = formData.get("email") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const secondaryColor = formData.get("secondaryColor") as string;
    const backgroundColor = formData.get("backgroundColor") as string;
    const accentColor = formData.get("accentColor") as string;
    const fontFamily = formData.get("fontFamily") as string;
    const customCss = formData.get("customCss") as string;
    
    const existing = await getSettings();
    const values = {
      siteName, showSiteName, logoUrl, faviconUrl, copyrightText,
      githubUrl, linkedinUrl, twitterUrl, facebookUrl, instagramUrl,
      email, primaryColor, secondaryColor, backgroundColor, accentColor,
      fontFamily, customCss
    };


    if(existing) {
      await db.update(settings).set(values).where(eq(settings.id, existing.id));
    } else {
      await db.insert(settings).values(values);
    }
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch(e) { return { success: false, error: "Failed to update settings" }; }
}

