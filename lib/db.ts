import { Db, MongoClient } from "mongodb";

export async function getDatabase(): Promise<Db> {
  let client = await new MongoClient(
    process.env.DATABASE_URL!,
    {
      auth: {
        username: process.env.DATABASE_USERNAME!,
        password: process.env.DATABASE_PASSWORD!
      }
    }
  ).connect()

  return client.db(process.env.DATABASE_NAME!)
}

