import "dotenv/config";
import { z } from "zod";

// Duplicate schema for standalone checking without importing server code
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  PORT: z.coerce.number().default(5000),
});

try {
  console.log("🔒 Validating Environment Variables...");
  // Check process.env
  envSchema.parse(process.env);
  console.log("✅ Environment Validated.");
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error("❌ Invalid Environment:");
    console.error(e.flatten().fieldErrors);
  } else {
    console.error(e);
  }
  process.exit(1);
}
