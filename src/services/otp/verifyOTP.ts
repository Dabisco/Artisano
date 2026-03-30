import { supabase } from "@/config/db.js";
import { verificationModel } from "@/models/verificationModel.js";
import { validateOTP } from "./validateOTP.js";
import { NotFoundError } from "@/errors/index.js";

export const verifyOTP = async (user_id: string, otp: string) => {
  const record = await verificationModel.getOTPByUserId(user_id);
  if (!record) {
    throw new NotFoundError("No OTP found for this user", "verifyOTP");
  }
  await validateOTP(record, otp);
  await supabase.rpc("verify_user_otp_rpc", { p_user_id: user_id });
  return true;
};
