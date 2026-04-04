import { Request, Response, NextFunction } from "express";
import { registerUser } from "@/services/authService.js";
import { CookieOptions } from "express";
import { verifyOTP } from "@/services/otp/verifyOTP.js";
import { UnauthorizedError } from "@/errors/client.errors.js";
import { loginUser } from "@/services/authService.js";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response) => {
  const { user, token } = await registerUser(req.body);

  // Store JWT in HTTP-only cookie
  res.cookie("token", token, COOKIE_OPTIONS);

  res
    .status(201)
    .json({ user, message: "Please verify your email address to continue" });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { otp } = req.body;

  // req.user is set by verifyJWT middleware
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized", "authController.verifyEmail");
  }

  await verifyOTP(userId, otp);

  res.status(200).json({ message: "Email verified successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { user, token } = await loginUser(req.body);

  // Store JWT in HTTP-only cookie
  res.cookie("token", token, COOKIE_OPTIONS);

  res.status(200).json({ user, message: "Login successful" });
};
