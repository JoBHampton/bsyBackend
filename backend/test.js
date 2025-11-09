const { MongoClient } = require("mongodb");
require("dotenv").config();

async function run() {
  const client = new MongoClient(process.env.MONGO_URI, { tls: true });
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB with native driver");

    const db = client.db("bigSpoonYum");
    const collections = await db.listCollections().toArray();
    console.log("📦 Collections:", collections);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
