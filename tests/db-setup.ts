import { MongoClient, Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { beforeAll, afterAll, beforeEach } from "vitest";
import { seedTestData } from "./db-seed";

let mongoServer: MongoMemoryServer;
let client: MongoClient;

export let db: Db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.TEST_DB || "test_db");
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
  await seedTestData();
});
