"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Fetches the 'Contact' section data from the database.
 */
export async function getContact() {
  try {
    const db = await getDb();
    const res = await db.collection("contacts").findOne({});
    if (res) {
      return { ...res, id: res._id.toString() };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch contact details:", error);
    return null; 
  }
}

export async function updateContact(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    
    const db = await getDb();
    const existing = await db.collection("contacts").findOne({});
    
    const payload = { email, phone, location, updatedAt: new Date() };

    if (existing) {
      await db.collection("contacts").updateOne(
        { _id: existing._id },
        { $set: payload }
      );
    } else {
      await db.collection("contacts").insertOne({
        ...payload,
        _id: crypto.randomUUID()
      });
    }
    revalidatePath("/");
    revalidatePath("/admin/contact");
    return { success: true };
  } catch { return { success: false }; }
}
