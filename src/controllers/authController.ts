import { Request, Response, NextFunction } from "express";
import { registerUser } from "@/services/authService.js";
import { CookieOptions } from "express";
import { verifyOTP } from "@/services/otp/verifyOTP.js";
import { UnauthorizedError } from "@/errors/client.errors.js";
import { loginUser } from "@/services/authService.js";
import { resendOTP } from "@/services/otp/resendOTP.js";

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
    .json({ user, message: "Please proceed to verify your email address!" });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { otp } = req.body;

  // req.user is set by verifyJWT middleware
  const userId = req.user?.userId;

  if (!userId) {
    throw new UnauthorizedError(
      "Please login to continue",
      "authController.verifyEmail",
    );
  }

  await verifyOTP(userId, otp);

  res.status(200).json({ message: "Email verified successfully!" });
};

export const login = async (req: Request, res: Response) => {
  const { user, token } = await loginUser(req.body);

  // Store JWT in HTTP-only cookie
  res.cookie("token", token, COOKIE_OPTIONS);

  res.status(200).json({ user, message: "Login successful!" });
};

export const resendOTPController = async (req: Request, res: Response) => {
  // req.user is set by verifyJWT middleware
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorizedError(
      "Please login to continue!",
      "authController.resendOTP",
    );
  }
  await resendOTP(userId);
  res.status(200).json({ message: "OTP sent successfully!" });
};
