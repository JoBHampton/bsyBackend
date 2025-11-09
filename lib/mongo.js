// /lib/mongo.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Missing MONGO_URI");

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Reuse a global during dev hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
  clientPromise = client.connect();
}

export async function getDb() {
  const c = await clientPromise;
  const dbName = process.env.MONGO_DB || "test";
  return c.db(dbName);
}
