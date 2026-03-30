export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: string;
  public readonly details?: any;
  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean,
    context?: string,
    details?: any,
  ) {
    super(message);
    this.name = "BaseError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    this.details = details;

    // Prevent prototype pollution attacks
    Error.captureStackTrace(this, this.constructor);
  }
}
