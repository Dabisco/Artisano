import { CreateUserInput } from "@/types/index.js";
import { ValidationError } from "@/errors/index.js";

type FieldError = {
  field: string;
  value: string;
  issue: string;
};

/**
 * Validation utilities for user input
 */

/**
 * Sanitize Phone number (remove spaces, dash)
 */

export const sanitizePhoneNumber = (phone_number: string): string => {
  return phone_number.replace(/[\s-]/g, "");
};

/**
 * Validate Nigerian Phone number format
 * Accepts: 080XXXXXXXX, 090XXXXXXXX, 070XXXXXXXX
 * Total: 11 digits starting with 0
 */

export const isValidNigerianPhone = (phone_number: string): boolean => {
  const phoneRegex = /^0[789][01]\d{8}$/;
  return phoneRegex.test(phone_number);
};

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least 1 number
 * - At least 1 letter
 */

export const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password)
  );
};

/**
 * Validate user type
 * Type guard to ensure type safety
 */

export const isValidUserType = (
  role: string,
): role is "artisan" | "client" | "admin" => {
  return role === "artisan" || role === "client" || role === "admin";
};

/**
 * Sanitize username (remove spaces, dash)
 */

export const sanitizeUsername = (username: string): string => {
  return username.trim().toLowerCase();
};

/**
 * Validate username
 */

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^(?=.*[a-z])[a-z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Sanitize email
 */

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Validate email
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate user input
 */

export const validateUserInput = (input: CreateUserInput): CreateUserInput => {
  const phone_number = sanitizePhoneNumber(input.phone_number);
  const username = sanitizeUsername(input.username);
  const email = sanitizeEmail(input.email);

  const errors: FieldError[] = [];
  if (!isValidNigerianPhone(phone_number)) {
    errors.push({
      field: "phone_number",
      value: phone_number,
      issue: "Must start with 0 and be 11 digits long",
    });
  }

  if (!isValidUsername(username)) {
    errors.push({
      field: "username",
      value: username,
      issue:
        "Must be at least 3 characters long and contain only letters, numbers and underscores",
    });
  }
  if (!isValidPassword(input.password)) {
    errors.push({
      field: "password",
      value: "[REDACTED]",
      issue:
        "Must be at least 8 characters long, contain at least one number and one letter",
    });
  }
  if (!isValidUserType(input.role)) {
    errors.push({
      field: "role",
      value: input.role,
      issue: "Must be artisan, client or admin",
    });
  }

  if (!isValidEmail(email)) {
    errors.push({
      field: "email",
      value: email,
      issue: "Must be a valid email address",
    });
  }

  if (errors.length > 0) {
    throw new ValidationError(
      "Invalid user input",
      "user.validation.validateUserInput",
      errors,
    );
  }

  return {
    ...input,
    phone_number,
    username,
    email,
  };
};
