import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "leaf",
  password: "0",
  database: "leafmanager"
});

export const db = drizzle(pool);
