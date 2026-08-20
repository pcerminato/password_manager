import { Collection, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.DB_NAME!;
const client = new MongoClient(MONGODB_URI);

export type Auth = { name: string; hash: string };
export type Passwords = {
  resource: string;
  password: string;
};
export type Collections = {
  auth: Collection<Auth>;
  passwords: Collection<Passwords>;
};

export async function connect() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const auth = db.collection<Auth>("auth");
    const passwords = db.collection<Passwords>("passwords");
    return {
      auth,
      passwords,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw new Error("Error connecting to the database");
  }
}
