export const isUUID = (value: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
    value,
  );
};

export const isPhone = (phone_number: string): boolean => {
  const phoneRegex = /^0[789][01]\d{8}$/;
  return phoneRegex.test(phone_number);
};

export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};
