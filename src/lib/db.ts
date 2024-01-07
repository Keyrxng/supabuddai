import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pool = (
  user: string,
  host: string,
  database: string,
  password: string,
  port: number
) => {
  const client = postgres(database, { prepare: false });
  const db = drizzle(client);

  return db;
};

export default pool;
