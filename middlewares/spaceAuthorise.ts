import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Payload } from "../types/playload";
import { JWT_ACCESS_TOKEN } from "../lib/config";
import { AuthenticatedRequest } from "../types/user";
import { PostgresClient } from "../lib/db";

export const spaceAuthorise: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.user?.id;
  const space_id = req.body.space_id;
  try {
    const spaceAuth = await PostgresClient.query(
      "SELECT * FROM spaces where id = $1 AND user_id = $2 LIMIT 1",
      [space_id, user_id]
    );

    if(!spaceAuth.rows[0]){}

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ error: "Invalid token!" });
  }
};
