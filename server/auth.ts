import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { User as DbUser } from "@shared/schema";
import { env } from "./env";

declare global {
  namespace Express {
    interface User extends DbUser {}
  }
}

  // Trust proxy for secure cookies behind reverse proxies (common in Docker/Cloud)
  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl / 1000,
    tableName: "sessions",
    pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
  });

  app.use(
    session({
      secret: env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // Secure cookies require HTTPS. In dev (localhost), we might not have it.
        // If NODE_ENV is production, we strictly require it.
        secure: env.NODE_ENV === "production",
        sameSite: "lax", // 'lax' is better for UX than 'strict' for top-level navigation
        maxAge: sessionTtl,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByEmail(username);
        if (!user || !user.password) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
