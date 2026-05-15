"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches all media items from the 'media' table and 
 * sorts them by newest first for the library display.
 */
export async function getMedia() {
  try {
    const db = await getDb();
    const mediaItems = await db.collection("media")
      .find({}, { projection: { content: 0 } }) // Exclude binary content for listing
      .sort({ createdAt: -1 })
      .toArray();

    return mediaItems.map(m => ({ ...m, id: m._id.toString() }));
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
    const db = await getDb();
    await db.collection("media").insertOne({
      ...data,
      _id: crypto.randomUUID(),
      createdAt: new Date()
    });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to add media:", error);
    return { success: false, error: "Failed to add media" };
  }
}

/**
 * Removes a media record from the database.
 */
export async function deleteMedia(id: string) {
  try {
    const db = await getDb();
    await db.collection("media").deleteOne({ _id: id });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete media:", error);
    return { success: false, error: "Failed to delete media" };
  }
}
