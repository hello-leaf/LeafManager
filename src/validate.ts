import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./usersRouter.js";

export function validatePost(req: Request, res: Response, next: NextFunction) {
  if(
    typeof req.body.title !== "string" ||
    typeof req.body.content !== "string" ||
    typeof req.body.done !== "boolean"
  ) return res.status(400).json("Bad data");

  return next();
}
export function validatePatch(req: Request, res: Response, next: NextFunction) {
  if(req.body.title !== undefined) {
    if(typeof req.body.title !== "string") return res.status(400).json("Bad data");
  }
  if(req.body.content !== undefined) {
    if(typeof req.body.content !== "string") return res.status(400).json("Bad data");
  }
  if(req.body.done !== undefined) {
    if(typeof req.body.done !== "boolean") return res.status(400).json("Bad data");
  }

  return next();
}

export function validateUserRegistration(req: Request, res: Response, next: NextFunction) {
  if(
    typeof req.body.email !== "string" ||
    typeof req.body.password !== "string"
  ) return res.status(400).json("Bad data for user");

  return next();
}

export function validateUserAuth(req: Request, res: Response, next: NextFunction) {
  if(typeof req.headers.authorization !== "string") return res.status(401).json(`No authorization`);

  const auth = req.headers.authorization.split(" ");
  if(auth[0] !== "Bearer") return res.status(401).json(`No authorization`);

  try {
    const verified = jwt.verify(auth[1]!, JWT_SECRET!);

    if (
      typeof verified !== "object" ||
      verified === null ||
      typeof verified.userId !== "number"
    ) {
      return res.status(401).json("Unauthorized");
    }

    req.user = {
      id: verified.userId
    };

    return next();
  } catch {
    return res.status(401).json("Unauthorized");
  }
}
