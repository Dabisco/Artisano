import { getUserByIdentifier } from "@/services/userService.js";
import { sendOTP } from "./sendOTP.js";
import { NotFoundError } from "@/errors/index.js";
import { BadRequestError } from "@/errors/index.js";
import { isWithinCoolDown } from "@/utils/time.js";
import { verificationModel } from "@/models/verificationModel.js";

export const resendOTP = async (user_id: string): Promise<void> => {
  // get user by id
  const user = await getUserByIdentifier(user_id);
  if (!user) {
    throw new NotFoundError("User not found", "otpService.resendOTP");
  }
  // check if user is verified
  if (user.email_verified) {
    throw new BadRequestError(
      "User is already verified!",
      "otpService.resendOTP",
    );
  }

  // get otp record
  const otpRecord = await verificationModel.getOTPByUserId(user_id);
  if (!otpRecord) {
    throw new NotFoundError("OTP record not found", "otpService.resendOTP");
  }
  // check if within cooldown period
  const { isWithinCoolDownPeriod, timeRemaining } = isWithinCoolDown(
    otpRecord.created_at,
    60,
  );
  if (isWithinCoolDownPeriod) {
    throw new BadRequestError(
      `Please wait ${timeRemaining} seconds before resending OTP`,
      "otpService.resendOTP",
    );
  }

  // send new otp
  await sendOTP(user.id);
};
