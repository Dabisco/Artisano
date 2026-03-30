import { supabase } from "@/config/db.js";
import { verificationModel } from "@/models/verificationModel.js";
import { validateOTP } from "./validateOTP.js";
import { NotFoundError, DatabaseError } from "@/errors/index.js";

export const verifyOTP = async (user_id: string, otp: string) => {
  const record = await verificationModel.getOTPByUserId(user_id);
  if (!record) {
    throw new NotFoundError("No OTP found for this user", "verifyOTP");
  }
  await validateOTP(record, otp);
  const { error } = await supabase.rpc("verify_user_otp_rpc", {
    p_user_id: user_id,
  });
  if (error) {
    throw new DatabaseError("Failed to verify OTP", error, "verifyOTP");
  }
  return true;
};
