import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  PORT: z.coerce.number().default(5000),
});

const weakDefaults = [
  "dev_secret_key_123",
  "activeloop_secret",
  "secret",
  "password",
  "changeme",
  "super_secret_session_key"
];

// Validate and export
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  const env = parsed.data;

  // Additional security check for weak secrets
  if (weakDefaults.includes(env.SESSION_SECRET)) {
    const msg = "SESSION_SECRET is using a known weak default value.";
    if (env.NODE_ENV === "production") {
      throw new Error(`❌ CRITICAL SECURITY FAILURE: ${msg}`);
    } else {
      console.warn(`⚠️ [SECURITY WARNING] ${msg}`);
    }
  }

  return env;
}

export const env = validateEnv();
