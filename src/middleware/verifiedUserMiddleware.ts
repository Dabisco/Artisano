import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/errors/client.errors.js";
import { getUserByIdentifier } from "@/services/userService.js";

export const verifiedUserCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // req.user is set by verifyJWT middleware
  const user_id = req.user?.userId;

  if (!user_id) {
    throw new UnauthorizedError("Unauthorized", "middlewareverifiedUserCheck");
  }

  const user = await getUserByIdentifier(user_id);
  if (!user.email_verified) {
    throw new UnauthorizedError(
      "Please verify your email address to continue",
      "middlewareverifiedUserCheck",
    );
  }
  next();
};
