-- 1. Create the base Users table
-- This table stores only the most fundamental authentication and role data.
CREATE TABLE public.users (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(), -- A unique, unguessable ID for every user
    phone_number VARCHAR(15) NOT NULL UNIQUE, -- The core login method, must be unique across the entire app
    username VARCHAR(50) NOT NULL UNIQUE, -- A unique identifier for the user to sign in securely
    password_hash VARCHAR(255) NOT NULL, -- The securely hashed password for authentication (never store plain text!)
    role VARCHAR(10) NOT NULL CHECK (role IN ('artisan', 'client', 'admin')), -- Strictly enforces that a user can only be one of these three roles
    email TEXT NOT NULL UNIQUE, -- Explicitly added from database changes
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE, -- Replaces is_verified
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Automatically records exactly when they signed up
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Automatically updates whenever a row changes
);

-- 1.5 Create Email Verifications Table
CREATE TABLE public.email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_verifications_token 
ON public.email_verifications(token);

-- 2. Create States Table
-- Used to standardize locations across the platform rather than relying on typed strings
CREATE TABLE public.states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Create Local Government Areas (LGAs) Table
-- Links directly to the State
    CREATE TABLE public.lgas (
    id SERIAL PRIMARY KEY,
    state_id INTEGER NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    UNIQUE(state_id, name) -- Prevents duplicate LGA names within the same state
);

-- 4. Create Categories Table
-- Broad industry groupings (e.g., 'Construction', 'Technology')
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 5. Create Occupations Table
-- Standardizes the list of available jobs (e.g., Electrician, Plumber)
CREATE TABLE public.occupations (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 6. Create Skills Table
-- Standardizes the specific abilities an artisan possesses (e.g., 'Pipe Fitting', 'Wiring')
CREATE TABLE public.skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 7. Create the Artisan Profiles table
-- This table is ONLY for artisans. It links directly back to the Users table.
CREATE TABLE public.artisan_profiles (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE, -- If the User is deleted, their Artisan Profile is automatically deleted too. The UNIQUE constraint ensures one user = ONE profile.
    full_name VARCHAR(255) NOT NULL, -- The name clients will see when searching or viewing an artisan
    lga_id INTEGER NOT NULL REFERENCES public.lgas(id), -- Links directly to the exact Local Government Area
    bio TEXT, -- Optional description of their experience
    availability_status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')), -- Allows artisans to toggle if they are taking new jobs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create Artisan Occupations Junction Table
-- This allows an artisan to have multiple occupations, and ensures data consistency
CREATE TABLE public.artisan_occupations (
    artisan_id UUID NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
    occupation_id INTEGER NOT NULL REFERENCES public.occupations(id) ON DELETE CASCADE,
    PRIMARY KEY (artisan_id, occupation_id) -- Prevents an artisan from adding the identical occupation twice
);

-- 9. Create Artisan Skills Junction Table
-- This allows an artisan to list multiple specific skills from the standardized table
CREATE TABLE public.artisan_skills (
    artisan_id UUID NOT NULL REFERENCES public.artisan_profiles(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    PRIMARY KEY (artisan_id, skill_id) -- Prevents an artisan from adding the identical skill twice
);

-- 10. Create the Client Profiles table
-- This table is ONLY for clients looking to hire artisans.
CREATE TABLE public.client_profiles (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),     
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE, -- Exact same logic as Artisan Profiles.
    full_name VARCHAR(255) NOT NULL, -- The name artisans will see when receiving a job request
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Create an automatic trigger function for updated_at
-- This function automatically sets `updated_at` to the current time whenever a row is modified
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 12. Attach the trigger to our three new tables
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_artisan_profiles_updated_at
BEFORE UPDATE ON public.artisan_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_client_profiles_updated_at
BEFORE UPDATE ON public.client_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 13. Create Indexes for extremely fast lookups
-- These indexes tell PostgreSQL to keep a sorted map of these columns in memory,
-- turning a 500ms full-table search into a 5ms instant lookup.

-- Index for User Logins: We will look up users heavily by phone number or username
CREATE INDEX idx_users_phone_number ON public.users(phone_number);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);

-- Index for Artisan Search: Clients will constantly search artisans by what they do and where they are
CREATE INDEX idx_artisan_profiles_lga_id ON public.artisan_profiles(lga_id);
CREATE INDEX idx_artisan_profiles_availability_status ON public.artisan_profiles(availability_status);
CREATE INDEX idx_artisan_occupations_occupation_id ON public.artisan_occupations(occupation_id);
CREATE INDEX idx_artisan_skills_skill_id ON public.artisan_skills(skill_id);

-- Note regarding Row Level Security (RLS) and Triggers: 
-- We will enable Supabase RLS policies and database Triggers (like updating the trust_score) in later SQL steps once the core tables are generated.
