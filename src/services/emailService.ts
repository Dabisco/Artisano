import transporter from "@/config/mailer.js";
import { InternalServerError } from "@/errors/index.js";

export const sendVerificationEmail = async (
  email: string,
  token: string,
): Promise<Boolean> => {
  try {
    await transporter.sendMail({
      from: `Artisano ${process.env.SMTP_USER}`,
      to: email,
      subject: "Verify your email",
      html: `
                <h1>Verify your email</h1>
                <p>Your verification code is: ${token}</p>
                <p>This code will expire in 10 minutes</p>
                `,
    });
    return true;
  } catch (error) {
    throw new InternalServerError(
      "Failed to send verification email",
      error,
      "emailService.sendVerificationEmail",
    );
  }
};
