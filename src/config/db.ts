import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Ensure the required environment variables are present before proceeding
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

// Initialize the Supabase client
// We use the SERVICE_ROLE_KEY because this backend needs admin-level access 
// (e.g., to verify OTPs or manipulate tables securely)
export const supabase = createClient(supabaseUrl, supabaseKey);
