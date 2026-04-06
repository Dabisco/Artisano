import nodemailer from "nodemailer";
import { validateEnv } from "./env.js";

const env = validateEnv(process.env);

// 1. create transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export default transporter;
