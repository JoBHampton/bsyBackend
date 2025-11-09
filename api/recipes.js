// /api/recipes.js
import { ObjectId } from "mongodb";
import { getDb } from "../lib/mongo.js";

// body parser
function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", c => (data += c));
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

// query param helper
function getQueryParam(req, key) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return url.searchParams.get(key);
}

async function pickCollection(db, preferred) {
  // If client asked explicitly, use that
  if (preferred) return db.collection(preferred);

  // Try "recipes" first
  const recipesCol = db.collection("recipes");
  const recipesHas = await recipesCol.estimatedDocumentCount();
  if (recipesHas > 0) return recipesCol;

  // Fallback to "recipe"
  const recipeCol = db.collection("recipe");
  const recipeHas = await recipeCol.estimatedDocumentCount();
  if (recipeHas >= 0) return recipeCol; // return even if 0, to keep name stable

  // default
  return recipesCol;
}

export default async function handler(req, res) {
  try {
    const db = await getDb();
    const requested = getQueryParam(req, "col");
    const col = await pickCollection(db, requested);

    if (req.method === "GET") {
      const id = getQueryParam(req, "id");
      if (id) {
        const doc = await col.findOne({ _id: new ObjectId(id) });
        return res.status(200).json(doc);
      }
      const docs = await col.find({}).sort({ _id: -1 }).limit(50).toArray();
      return res.status(200).json(docs);
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      const now = new Date();
      const r = await col.insertOne({
        title: body.title || "Untitled",
        ingredients: body.ingredients || [],
        instructions: body.instructions || "",
        createdAt: now,
        updatedAt: now,
      });
      return res.status(200).json({ insertedId: r.insertedId });
    }

    if (req.method === "PATCH") {
      const body = await readJson(req);
      if (!body.id) return res.status(400).json({ error: "Missing id" });
      const { id, ...updates } = body;
      updates.updatedAt = new Date();
      await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const body = await readJson(req);
      if (!body.id) return res.status(400).json({ error: "Missing id" });
      await col.deleteOne({ _id: new ObjectId(body.id) });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET,POST,PATCH,DELETE");
    return res.status(405).end("Method Not Allowed");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
}
