create or replace function verify_user_otp_rpc(p_user_id uuid)
returns void as $$
begin
  -- Delete OTP
  delete from public.email_verifications
  where user_id = p_user_id;

  -- Mark user verified
  update public.users
  set email_verified = true,
      updated_at = now()
  where id = p_user_id;

end;
$$ language plpgsql;