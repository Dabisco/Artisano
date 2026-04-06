import { createClient } from "@supabase/supabase-js";
import { validateEnv } from "./env.js";

const env = validateEnv(process.env);

// Initialize the Supabase client
// We use the SERVICE_ROLE_KEY because this backend needs admin-level access
// (e.g., to verify OTPs or manipulate tables securely)
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
);
