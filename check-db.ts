import { getDb } from "./src/lib/db";

async function checkDb() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    console.log("Collections in DB:");
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }
  } catch (error) {
    console.error("Error checking DB:", error);
  }
}

checkDb();
