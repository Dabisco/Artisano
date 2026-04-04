import { userModel } from "@/models/userModel.js";
import { InternalServerError } from "@/errors/index.js";
import { generateOTP, hashToken } from "@/utils/crypto.js";
import { sendVerificationEmail } from "@/services/emailService.js";
import { verificationModel } from "@/models/verificationModel.js";
import { EmailVerificationInsert } from "@/types/index.js";

export const sendOTP = async (user_id: string) => {
  const user = await userModel.getUserById(user_id);
  if (!user) {
    throw new InternalServerError("User not found", "userModel.getUserById");
  }
  const otp = generateOTP();
  const hashedOTP = hashToken(otp);
  const expires_at = new Date(Date.now() + 10 * 60 * 1000);
  const verificationData: EmailVerificationInsert = {
    user_id: user.id,
    token_hash: hashedOTP,
    expires_at: expires_at.toISOString(),
  };

  await verificationModel.createOTP(verificationData);
  await sendVerificationEmail(user.email, otp);
  return true;
};
