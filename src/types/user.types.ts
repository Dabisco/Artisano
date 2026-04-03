export interface CreateUserInput {
  phone_number: string;
  username: string;
  password: string;
  email: string;
  role: "artisan" | "client" | "admin";
  first_name: string;
  surname: string;
  other_names?: string;
  lga_id?: number;
}

export type SafeUser = {
  id: string;
  email: string;
  username: string;
  role: string;
};
