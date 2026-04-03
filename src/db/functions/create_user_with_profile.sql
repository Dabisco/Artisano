-- Function: create_user_with_profile
-- Description: Safely creates a user and associated profile atomically

create or replace function create_user_with_profile(
    user_data jsonb,
    profile_data jsonb
)
returns jsonb
language plpgsql
as $$
declare
    new_user users;
begin
    -- ===========================
    -- 1. Insert user safely
    -- Only use expected fields
    -- ===========================
    insert into users (
        phone_number,
        username,
        password_hash,
        email,
        role
    )
    values (
        user_data->>'phone_number',
        user_data->>'username',
        user_data->>'password_hash',
        user_data->>'email',
        user_data->>'role'
    )
    returning * into new_user;

    -- ===========================
    -- 2. Insert profile based on role
    -- ===========================
    if (user_data->>'role') = 'artisan' then

        insert into artisan_profiles (
            user_id,
            first_name,
            other_names,
            surname,
            lga_id
        )
        values (
            new_user.id,
            profile_data->>'first_name',
            profile_data->>'other_names',
            profile_data->>'surname',
            (profile_data->>'lga_id')::int
        );

    elsif (user_data->>'role') = 'client' then

        insert into client_profiles (
            user_id,
            first_name,
            other_names,
            surname
        )
        values (
            new_user.id,
            profile_data->>'first_name',
            profile_data->>'other_names',
            profile_data->>'surname'
        );

    elsif (user_data->>'role') = 'admin' then
        -- No profile needed
        null;

    else
        raise exception 'Invalid role: %', user_data->>'role';
    end if;

    -- ===========================
    -- 3. Return the newly created user
    -- ===========================
    return to_jsonb(new_user);

end;
$$;