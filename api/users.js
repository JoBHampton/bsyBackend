// /api/users.js
import { getDb } from "../lib/mongo.js";

function getQueryParam(req, key) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.searchParams.get(key);
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const coll = getQueryParam(req, "col") || "users";
    const col = db.collection(coll);

    if (req.method === "GET") {
      const docs = await col.find({}).limit(200).toArray();
      return res.status(200).json(docs);
    }

    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
