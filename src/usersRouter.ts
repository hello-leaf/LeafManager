import express from "express";
import { db } from "./db.js";
import { usersDb } from "./schema.js";
import { validateUserRegistration } from "./validate.js";
import { eq } from "drizzle-orm";
import * as bcrypt from 'bcrypt';
import "dotenv/config";
import jwt from "jsonwebtoken";
import { exit } from "node:process";

export const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET){
  console.error(`JWT_SECRET not provided`);
  exit(1);
}

export const usersRouter = express.Router();

usersRouter.post("/register", validateUserRegistration, async (req, res) => {
  const emailExists = await db.select().from(usersDb).where(eq(usersDb.email, req.body.email));

  if(emailExists.length > 0) return res.status(409).json(`User with email ${req.body.email} already exists`);

  const h = await bcrypt.hash(req.body.password, 10);

  const user = await db.insert(usersDb).values({
    passwordHash: h,
    email: req.body.email
  }).returning();

  if(user.length === 0) return res.status(500).json(`User's data failed to add`);

  const { passwordHash, ...userWithoutHash } = user[0]!;

  res.status(201).json(userWithoutHash);
});

usersRouter.post("/login", validateUserRegistration, async (req, res) => {
  const user = await db.select().from(usersDb).where(eq(usersDb.email, req.body.email));
  if(user.length <= 0) return res.status(401).json(`Invalid credentials`);

  const h = await bcrypt.compare(req.body.password, user[0]?.passwordHash!);
  if(!h) return res.status(401).json(`Invalid credentials`);

  const token = jwt.sign({userId: user[0]!.id}, JWT_SECRET);

  res.status(200).json({ token: token });
});
