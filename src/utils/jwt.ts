import jwt, { SignOptions } from "jsonwebtoken";
import { validateEnv } from "@/config/env.js";

const env = validateEnv(process.env);

const JWT_SECRET = env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d",
): string | null => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error) {
    return null;
  }
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
