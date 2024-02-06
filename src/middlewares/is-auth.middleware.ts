import { NextFunction, Request, Response } from "express";
import { throwUnauthorizedException } from "purrts/lib/common";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export default async function (req: Request, _: Response, next: NextFunction) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return throwUnauthorizedException("Authorization header is missing!");
  }
  const token = authHeader.replace("Bearer", "").trim();
  if (!token) {
    return throwUnauthorizedException("Token is missing!");
  }
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err: unknown) {
    return throwUnauthorizedException((err as any).message);
  }
  (req as any).playerId = decoded.playerId;
  next();
}
