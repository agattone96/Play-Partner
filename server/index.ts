import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { logger, logRequest } from "./log";

export { logger };

const app = express();
const httpServer = createServer(app);

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now as it might conflict with Vite/dev execution scripts
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Replaces custom log function
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      logRequest(req, res, duration, capturedJsonResponse);
    }
  });

  next();
});

import { storage } from "./storage";
import bcrypt from "bcryptjs";

// Seed users
async function seedUsers() {
  const hashedPassword = await bcrypt.hash("BadPenny7", 10);
  
  const admins = [
    {
      email: "allisongattone@gmail.com",
      firstName: "Allison",
      lastName: "Gattone",
      role: "admin" as const,
    },
    {
      email: "theblackroxanne@gmail.com",
      firstName: "Roxanne",
      lastName: "Bogalis",
      role: "admin" as const,
    }
  ];

  for (const admin of admins) {
    const existing = await storage.getUserByEmail(admin.email);
    // Only seed if user doesn't exist or if we want to force reset for this migration
    // For now, let's update them to ensure they have the new password structure
    await storage.upsertUser({
      ...(existing || {}), // Keep existing ID if any
      ...admin,
      password: hashedPassword,
      isPasswordResetRequired: true,
      // Ensure other required fields are present if creating new
      id: existing?.id || undefined, 
    });
    logger.info(`Seeded/Updated admin: ${admin.email}`);
  }
}

(async () => {
  await seedUsers();
  await registerRoutes(httpServer, app);

  // Centralized Error Handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Log error securely (avoid sensitive info leak if possible but log stacktrace for debugging)
    logger.error("Internal Server Error", { message, stack: err.stack, status });

    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
    },
    () => {
      logger.info(`serving on port ${port}`);
    },
  );
})();
