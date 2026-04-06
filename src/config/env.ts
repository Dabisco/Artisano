interface Env {
  PORT: number;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  JWT_SECRET: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;

  NODE_ENV: "development" | "production" | "test";
}

export function validateEnv(env: NodeJS.ProcessEnv): Env {
  //check if any of the environment variables are undefined
  if (!env.PORT) {
    throw new Error("PORT is not defined");
  }
  if (!env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not defined");
  }
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
  }
  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  if (!env.SMTP_HOST) {
    throw new Error("SMTP_HOST is not defined");
  }
  if (!env.SMTP_PORT) {
    throw new Error("SMTP_PORT is not defined");
  }
  if (!env.SMTP_USER) {
    throw new Error("SMTP_USER is not defined");
  }
  if (!env.SMTP_PASS) {
    throw new Error("SMTP_PASS is not defined");
  }
  if (!env.NODE_ENV) {
    throw new Error("NODE_ENV is not defined");
  }

  // convert types
  const port = Number(env.PORT);
  const smtpPort = Number(env.SMTP_PORT);

  // validate types
  if (isNaN(port)) {
    throw new Error("PORT must be a number");
  }
  if (isNaN(smtpPort)) {
    throw new Error("SMTP_PORT must be a number");
  }

  // validate node env
  const allowedNodeEnvs = ["development", "production", "test"];
  if (!allowedNodeEnvs.includes(env.NODE_ENV)) {
    throw new Error("NODE_ENV is not valid");
  }

  // return env
  return {
    PORT: port,
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY,
    JWT_SECRET: env.JWT_SECRET,
    SMTP_HOST: env.SMTP_HOST,
    SMTP_PORT: smtpPort,
    SMTP_USER: env.SMTP_USER,
    SMTP_PASS: env.SMTP_PASS,
    NODE_ENV: env.NODE_ENV as Env["NODE_ENV"],
  };
}
