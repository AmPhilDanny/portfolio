"use server";
import { db } from "@/lib/db";
import { contacts } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getContact() {
  try {
    const res = await db.select().from(contacts).limit(1);
    return res.length > 0 ? res[0] : null;
  } catch { return null; }
}

export async function updateContact(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const existing = await getContact();
    if (existing) {
      await db.update(contacts).set({ email, phone, location }).where(eq(contacts.id, existing.id));
    } else {
      await db.insert(contacts).values({ email, phone, location });
    }
    revalidatePath("/");
    revalidatePath("/admin/contact");
    return { success: true };
  } catch { return { success: false }; }
}
