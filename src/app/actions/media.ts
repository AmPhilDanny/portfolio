"use server";

import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches all media items from the 'media' table and 
 * sorts them by newest first for the library display.
 */
export async function getMedia() {
  try {
    return await db.select().from(media).orderBy(desc(media.createdAt));
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return [];
  }
}

/**
 * Creates a new media entry after a success binary/blob upload.
 */
export async function addMedia(data: { name: string; url: string; type: string; size?: string }) {
  try {
    await db.insert(media).values(data);
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to add media:", error);
    return { success: false, error: "Failed to add media" };
  }
}

/**
 * Removes a media record from the database.
 * Note: Actual binary storage cleanup (if external) should happen here too.
 */
export async function deleteMedia(id: string) {
  try {
    await db.delete(media).where(eq(media.id, id));
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media:", error);
    return { success: false, error: "Failed to delete media" };
  }
}

