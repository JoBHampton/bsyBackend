import { getDb } from "../lib/mongo.js";

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const dbName = db.databaseName;

    // list collections
    const cols = await db.listCollections().toArray();
    const collectionNames = cols.map(c => c.name).sort();

    // try the expected collection
    const col = db.collection("recipes");
    const count = await col.countDocuments({});
    const sample = await col.find({}).limit(1).toArray();

    res.status(200).json({
      dbName,
      envDb: process.env.MONGO_DB || "(unset)",
      collectionNames,
      recipesCount: count,
      sampleRecipe: sample[0] || null
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
}
