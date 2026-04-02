import { NextFunction, Request, Response } from "express";
import { BaseError } from "@/errors/base.error.js";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If it's a known error
  if (error instanceof BaseError && error.isOperational) {
    console.warn("Operational error: ", error);
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      context: error.context,
      details: error.details || [], // Empty array if no details
    });
  } else if (error instanceof BaseError && !error.isOperational) {
    console.error("Non-operational error: ", error);
    return res.status(error.statusCode).json({
      success: false,
      message: "Something went wrong!",
    });
  }
  // If it's an unknown error (fallback)
  console.error("Unknown error: ", error);
  return res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
};
