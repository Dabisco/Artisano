import { UserRow } from "@/types/index.js";
import { SafeUser } from "@/types/user.types.js";

export const sanitizeUser = (user: UserRow): SafeUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
});
