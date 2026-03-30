import crypto from "crypto";
import { EmailVerificationRow } from "@/types/index.js";
import { hashToken } from "@/utils/crypto.js";
import { verificationModel } from "@/models/verificationModel.js";
import { NotFoundError, ValidationError } from "@/errors/index.js";

export const validateOTP = async (
  record: EmailVerificationRow,
  otp: string,
) => {
  // Check if OTP has expired
  if (new Date(record.expires_at) < new Date()) {
    throw new ValidationError("OTP has expired!", "services.otp.validateOTP");
  }

  // Hash user OTP
  const hashedOTP = hashToken(otp);

  // Compare user OTP input with the hashed OTP in the database
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(hashedOTP),
    Buffer.from(record.token_hash),
  );
  if (!isMatch) {
    throw new ValidationError("Invalid OTP!", "validateOTP");
  }

  return true;
};
