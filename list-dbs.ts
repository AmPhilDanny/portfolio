import { MongoClient } from 'mongodb';

async function listDbs() {
  const uri = "mongodb+srv://Vercel-Admin-atlas-folio:GhqIwHYXiXsN5B1y@atlas-folio.wbndglk.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log("Databases in cluster:");
    for (const dbInfo of dbs.databases) {
      console.log(`- ${dbInfo.name}`);
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  * ${col.name}: ${count} documents`);
      }
    }
  } catch (error) {
    console.error("Error listing DBs:", error);
  } finally {
    await client.close();
  }
}

listDbs();
