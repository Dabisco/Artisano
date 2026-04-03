import { CreateUserInput } from "@/types/user.types.js";
import { UserInsert } from "@/types/index.js";
import { ArtisanProfileInsert, ClientProfileInsert } from "@/types/index.js";
import { validateUserInput } from "@/utils/validation/index.js";
import { userModel } from "@/models/userModel.js";
import { InternalServerError } from "@/errors/index.js";
import { ConflictError } from "@/errors/index.js";
import { DatabaseError } from "@/errors/index.js";
import { UserRow } from "@/types/index.js";
import { hashPassword } from "@/utils/hashPassword.js";
import { NotFoundError } from "@/errors/index.js";

export const createUser = async (input: CreateUserInput): Promise<UserRow> => {
  // 1. Validate input
  const validatedInput = validateUserInput(input);
  // 2. Hash password
  const hashedPassword = await hashPassword(validatedInput.password);

  // 3. prepare user data
  const userData: UserInsert = {
    phone_number: validatedInput.phone_number,
    username: validatedInput.username,
    password_hash: hashedPassword,
    email: validatedInput.email,
    role: validatedInput.role,
  };

  // 4. prepare profile data
  let profileData:
    | Omit<ArtisanProfileInsert, "user_id">
    | Omit<ClientProfileInsert, "user_id">
    | null;

  if (validatedInput.role === "artisan") {
    profileData = {
      first_name: validatedInput.first_name,
      other_names: validatedInput.other_names,
      surname: validatedInput.surname,
      lga_id: validatedInput.lga_id,
    };
  } else {
    profileData = {
      first_name: validatedInput.first_name,
      other_names: validatedInput.other_names,
      surname: validatedInput.surname,
    };
  }

  // 5. Create user and profile in a transaction
  try {
    const newUser = await userModel.createUser(userData, profileData);

    if (!newUser) {
      throw new InternalServerError(
        "Failed to create user",
        "userModel.createUser",
      );
    }
    return newUser;
  } catch (error: unknown) {
    if (
      error instanceof DatabaseError &&
      error.originalError.code === "23505"
    ) {
      throw new ConflictError(error.message, "userService.createUser");
    }
    throw error;
  }
};

export const getUserById = async (user_id: string): Promise<UserRow> => {
  const user = await userModel.getUserByIdentifier(user_id);
  if (!user) {
    throw new NotFoundError("User not found", "userService.getUserById");
  }
  return user;
};
