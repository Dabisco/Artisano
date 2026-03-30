import crypto from "crypto";

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
