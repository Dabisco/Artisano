import { supabase } from "@/config/db.js";
import { DatabaseError } from "@/errors/index.js";
import {
  UserInsert,
  ArtisanProfileInsert,
  ClientProfileInsert,
  UserRow,
} from "@/types/index.js";

export class userModel {
  static getUserByIdentifier = async (
    identifier: string,
  ): Promise<UserRow | null> => {
    const { data: record, error } = await supabase
      .from("users")
      .select("*")
      .or(`username.eq.${identifier},phone_number.eq.${identifier}`)
      .maybeSingle();

    if (error)
      throw new DatabaseError(
        error.message,
        error,
        "userModel.getUserByIdentifier",
      );

    return record;
  };

  static createUser = async (
    userData: UserInsert,
    profileData: Omit<
      ArtisanProfileInsert | ClientProfileInsert,
      "user_id"
    > | null,
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
