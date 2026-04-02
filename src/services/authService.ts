import { sendOTP } from "@/services/otp/sendOTP.js";
import { CreateUserInput } from "@/types/index.js";
import { createUser } from "@/services/userService.js";
import { SafeUser } from "@/types/user.types.js";
import { sanitizeUser } from "@/utils/sanitizeUser.js";
import { generateToken, JwtPayload, verifyToken } from "@/utils/jwt.js";
import { InternalServerError } from "@/errors/server.errors.js";

export const registerUser = async (
  userData: CreateUserInput,
): Promise<{ user: SafeUser; token: string | null }> => {
  // create user
  const newUser = await createUser(userData);
  // send otp
  await sendOTP(newUser.id);
  // get safe user data
  const safeUser = sanitizeUser(newUser);
  // generate jwt token
  const token = generateToken({ userId: newUser.id, role: newUser.role });
  if (!token) {
    throw new InternalServerError(
      "Error generating user jwt",
      "authService.registerUser",
    );
  }
  // return token + user data
  return {
    user: safeUser,
    token,
  };
};
