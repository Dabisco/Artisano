import { BaseError } from "./base.error.js";

export class InternalServerError extends BaseError {
  public originalError?: any;
  constructor(
    message: string,
    originalError?: any,
    context?: string,
    details?: any,
  ) {
    super(message, 500, false, context, details);
    this.name = "InternalServerError";
    this.originalError = originalError;
  }
}

export class DatabaseError extends BaseError {
  public originalError: any;
  constructor(
    message: string,
    originalError: any,
    context?: string,
    details?: any,
  ) {
    super(message, 500, false, context, details);
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}
