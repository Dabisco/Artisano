import { verifyToken } from "@/utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/errors/client.errors.js";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    throw new UnauthorizedError("Unauthorized", "verifyJWT");
  }
  const payLoad = verifyToken(token);
  if (!payLoad) {
    throw new UnauthorizedError("Unauthorized", "verifyJWT");
  }
  req.user = payLoad;
  next();
};
