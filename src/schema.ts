import { sql } from "drizzle-orm";
import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const usersDb = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`)
});
 
export const tasksDb = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersDb.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  done: boolean("done").notNull().default(false)
});
