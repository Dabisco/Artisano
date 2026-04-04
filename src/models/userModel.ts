import { supabase } from "@/config/db.js";
import { DatabaseError } from "@/errors/index.js";
import {
  UserInsert,
  ArtisanProfileInsert,
  ClientProfileInsert,
  UserRow,
} from "@/types/index.js";

export class userModel {
  static getUserById = async (user_id: string): Promise<UserRow> => {
    const { data: record, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .maybeSingle();

    if (error)
      throw new DatabaseError(error.message, error, "userModel.getUserById");

    return record;
  };

  static getUserByEmail = async (email: string): Promise<UserRow> => {
    const { data: record, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error)
      throw new DatabaseError(error.message, error, "userModel.getUserByEmail");

    return record;
  };

  static getUserByPhone = async (phone_number: string): Promise<UserRow> => {
    const { data: record, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", phone_number)
      .maybeSingle();

    if (error)
      throw new DatabaseError(error.message, error, "userModel.getUserByPhone");

    return record;
  };

  static getUserByUsername = async (username: string): Promise<UserRow> => {
    const { data: record, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error)
      throw new DatabaseError(
        error.message,
        error,
        "userModel.getUserByUsername",
      );

    return record;
  };

  static createUser = async (
    userData: UserInsert,
    profileData:
      | Omit<ArtisanProfileInsert, "user_id">
      | Omit<ClientProfileInsert, "user_id">
      | null,
  ): Promise<UserRow> => {
    // Call the RPC function
    const { data, error } = await supabase.rpc("create_user_with_profile", {
      user_data: userData,
      profile_data: profileData,
    });

    if (error)
      throw new DatabaseError(error.message, error, "userModel.createUser");

    return data;
  };
}
