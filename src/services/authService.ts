import { sendOTP } from "@/services/otp/sendOTP.js";
import { CreateUserInput } from "@/types/index.js";
import { createUser } from "@/services/userService.js";
import { SafeUser } from "@/types/user.types.js";
import { sanitizeUser } from "@/utils/sanitizeUser.js";
import { generateToken, JwtPayload, verifyToken } from "@/utils/jwt.js";
import { InternalServerError } from "@/errors/server.errors.js";
import { LoginUserInput } from "@/types/user.types.js";
import { getUserByIdentifier } from "@/services/userService.js";
import { comparePassword } from "@/utils/comparePassword.js";
import { UnauthorizedError } from "@/errors/client.errors.js";

export const registerUser = async (
  userData: CreateUserInput,
): Promise<{ user: SafeUser; token: string }> => {
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

export const loginUser = async (
  userData: LoginUserInput,
): Promise<{ user: SafeUser; token: string }> => {
  // get user by identifier
  const user = await getUserByIdentifier(userData.identifier);
  // compare password
  const isValidPassword = await comparePassword(
    userData.password,
    user.password_hash,
  );

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid password", "authService.loginUser");
  }

  const safeUser = sanitizeUser(user);

  //generate JWT
  const token = generateToken({ userId: user.id, role: user.role });
  if (!token) {
    throw new InternalServerError(
      "Error generating user jwt",
      "authService.loginUser",
    );
  }
  // return token + user data
  return {
    user: safeUser,
    token,
  };
};
