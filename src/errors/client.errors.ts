import { BaseError } from "./base.error.js";

export class NotFoundError extends BaseError {
  constructor(message: string, context?: string, details?: any) {
    super(message, 404, true, context, details);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends BaseError {
  constructor(message: string, context?: string, details?: any) {
    super(message, 400, true, context, details);
    this.name = "BadRequestError";
  }
}

export class ConflictError extends BaseError {
  constructor(message: string, context?: string, details?: any) {
    super(message, 409, true, context, details);
    this.name = "ConflictError";
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, context?: string, details?: any) {
    super(message, 422, true, context, details);
    this.name = "ValidationError";
  }
}
