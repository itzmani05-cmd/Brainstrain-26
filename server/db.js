import dns from "dns";
import { MongoClient } from "mongodb";

// Works around Node's DNS resolver failing SRV lookups on some Windows
// networks (ECONNREFUSED from c-ares) even though the OS resolver works fine.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

let client;
let db;

export async function getDb() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}
