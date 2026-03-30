export interface CreateUserInput {
  phone_number: string;
  username: string;
  password: string;
  email: string;
  role: "artisan" | "client" | "admin";
  full_name: string;
  lga_id?: number;
}
