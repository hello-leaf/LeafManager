import express from "express";
import { validatePost, validatePatch, validateUserAuth } from "./validate.js";
import { db } from "./db.js";
import { tasksDb, usersDb } from "./schema.js";
import { and, eq } from "drizzle-orm";

export const tasksRouter = express.Router();

tasksRouter.use(validateUserAuth);

tasksRouter.get("/", async (req, res) => {
  const tasks = await db.select().from(tasksDb).where(eq(tasksDb.userId, req.user.id));

  return res.status(200).json(tasks);
});

tasksRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) return res.status(400).json(`Id ${id} not valid`);

  try {
    const r = await db.select().from(tasksDb).where(and(eq(tasksDb.id, id), eq(tasksDb.userId, req.user.id)));

    if(r.length === 0) return res.status(404).json(`Not found`);

    return res.status(200).json(r[0]);
  } catch (e) {
    return res.status(500).json(`Got an error: ${e}`);
  }
});

tasksRouter.post("/", validatePost, async (req, res) => {
  const r = await db.insert(tasksDb).values({
    ...req.body,
    userId: req.user.id
  }).returning();

  res.status(201).json(r[0]);
});

tasksRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) return res.status(400).json(`Id ${id} not valid`);

  try {
    const r = await db.delete(tasksDb).where(and(eq(tasksDb.id, id), eq(tasksDb.userId, req.user.id))).returning();

    if(r.length > 0) return res.status(204).json();

    return res.status(404).json(`No data to delete`);
  } catch (e) {
    return res.status(500).json(`Got an error: ${e}`);
  }
});

tasksRouter.patch("/:id", validatePatch, async (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) return res.status(400).json(`Id ${id} not valid`);

  if(req.body.id !== undefined) return res.status(400).json(`No 'id' field should be provided`);

  try {
    const r = await db.update(tasksDb).set(req.body).where(and(eq(tasksDb.id, id), eq(tasksDb.userId, req.user.id))).returning();

    if(r.length <= 0) return res.status(404).json(`No data to update`);

    return res.status(200).json(r[0]);
  } catch (e) {
    return res.status(500).json(`Got an error: ${e}`);
  }
});
