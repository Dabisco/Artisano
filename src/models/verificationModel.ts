import { supabase } from "@/config/db.js";
import { DatabaseError } from "@/errors/index.js";
import {
  EmailVerificationInsert,
  EmailVerificationRow,
} from "@/types/index.js";

export class verificationModel {
  // Create a new OTP record or update existing OTP record
  static createOTP = async (
    verificationData: EmailVerificationInsert,
  ): Promise<void> => {
    const { error } = await supabase
      .from("email_verifications")
      .upsert(verificationData, { onConflict: "user_id" });

    if (error)
      throw new DatabaseError(
        error.message,
        error,
        "verificationModel.createOTP",
      );
  };

  static getOTP = async (
    user_id: string,
    tokenHash: string,
  ): Promise<EmailVerificationRow> => {
    const { data: record, error } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("user_id", user_id)
      .eq("token_Hash", tokenHash)
      .maybeSingle();

    if (error)
      throw new DatabaseError(error.message, error, "verificationModel.getOTP");

    return record;
  };

  static getOTPByUserId = async (
    user_id: string,
  ): Promise<EmailVerificationRow> => {
    const { data: record, error } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (error)
      throw new DatabaseError(
        error.message,
        error,
        "verificationModel.getOTPByUserId",
      );

    return record;
  };
}
