import { getDb } from "../lib/mongo.js";

function getQueryParam(req, key) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.searchParams.get(key);
}

// case-insensitive collection resolver with fallback
async function resolveCollection(db, requested) {
  if (!requested) return db.collection("users");

  // exact match first
  const exact = db.collection(requested);
  // verify it exists by listing and comparing names
  const cols = await db.listCollections().toArray();
  const names = cols.map(c => c.name);

  if (names.includes(requested)) return exact;

  // case-insensitive fallback (e.g., favtables -> FavTable)
  const ci = names.find(n => n.toLowerCase() === requested.toLowerCase());
  return db.collection(ci || requested);
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).end("Method Not Allowed");
    }
    const db = await getDb();
    const colParam = getQueryParam(req, "col"); // e.g., users, favtables, FavTable
    const col = await resolveCollection(db, colParam || "users");

    const limit = Number(getQueryParam(req, "limit") || 500);
    const docs = await col.find({}).limit(limit).toArray();
    return res.status(200).json(docs);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
