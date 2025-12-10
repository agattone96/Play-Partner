import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import passport from "passport";
import crypto from "crypto";
import { mailService } from "./services/mail";
import bcrypt from "bcryptjs";
import {
  insertPartnerSchema,
  insertAdminAssessmentSchema,
  insertTagSchema,
} from "@shared/schema";

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth routes
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/auth/user", isAuthenticated, (req, res) => {
    res.json(req.user);
  });

  app.post("/api/magic-link", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal user existence
        return res.json({ message: "If your email is registered, you will receive a magic link." });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await storage.updateUser(user.id, {
        magicLinkToken: token,
        magicLinkExpiresAt: expiresAt,
      });

      await mailService.sendMagicLink(email, token);

      res.json({ message: "If your email is registered, you will receive a magic link." });
    } catch (error) {
      console.error("Magic link error:", error);
      res.status(500).json({ message: "Failed to send magic link" });
    }
  });

  app.get("/api/magic-link/callback", async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Invalid token" });
    }

    try {
      const user = await storage.getUserByMagicLinkToken(token);
      if (!user) {
        return res.status(401).json({ message: "Invalid or expired magic link" });
      }

      // Invalidate token
      await storage.updateUser(user.id, {
        magicLinkToken: null,
        magicLinkExpiresAt: null,
      });

      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Failed to log in" });
        }
        res.redirect("/");
      });
    } catch (error) {
      console.error("Magic link callback error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/reset-password", isAuthenticated, async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = req.user as any;
      
      const updatedUser = await storage.updateUser(user.id, {
        password: hashedPassword,
        isPasswordResetRequired: false,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });


  // Dashboard
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const data = await storage.getDashboardData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Partners
  app.get("/api/partners", isAuthenticated, async (req, res) => {
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  app.post("/api/partners", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(validatedData);
      res.status(201).json(partner);
    } catch (error: any) {
      console.error("Error creating partner:", error);
      res.status(400).json({ message: error.message || "Failed to create partner" });
    }
  });

  app.get("/api/partners/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const partner = await storage.getPartnerById(id);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      console.error("Error fetching partner:", error);
      res.status(500).json({ message: "Failed to fetch partner" });
    }
  });

  app.patch("/api/partners/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPartnerSchema.partial().parse(req.body);
      const partner = await storage.updatePartner(id, validatedData);
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json(partner);
    } catch (error: any) {
      console.error("Error updating partner:", error);
      res.status(400).json({ message: error.message || "Failed to update partner" });
    }
  });

  app.delete("/api/partners/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePartner(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ message: "Failed to delete partner" });
    }
  });

  // Partner Intimacy
  app.get("/api/partners/:id/intimacy", isAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const intimacy = await storage.getPartnerIntimacy(partnerId);
      res.json(intimacy || null);
    } catch (error) {
      console.error("Error fetching intimacy:", error);
      res.status(500).json({ message: "Failed to fetch intimacy" });
    }
  });

  app.put("/api/partners/:id/intimacy", isAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const intimacy = await storage.upsertPartnerIntimacy({
        ...req.body,
        partnerId,
      });
      res.json(intimacy);
    } catch (error: any) {
      console.error("Error updating intimacy:", error);
      res.status(400).json({ message: error.message || "Failed to update intimacy" });
    }
  });

  // Partner Logistics
  app.get("/api/partners/:id/logistics", isAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const logistics = await storage.getPartnerLogistics(partnerId);
      res.json(logistics || null);
    } catch (error) {
      console.error("Error fetching logistics:", error);
      res.status(500).json({ message: "Failed to fetch logistics" });
    }
  });

  app.put("/api/partners/:id/logistics", isAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const logistics = await storage.upsertPartnerLogistics({
        ...req.body,
        partnerId,
      });
      res.json(logistics);
    } catch (error: any) {
      console.error("Error updating logistics:", error);
      res.status(400).json({ message: error.message || "Failed to update logistics" });
    }
  });

  // Partner Media
  app.get("/api/partners/:id/media", isAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const media = await storage.getPartnerMedia(partnerId);
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.post("/api/partners/:id/media", isAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const media = await storage.createPartnerMedia({
        ...req.body,
        partnerId,
      });
      res.status(201).json(media);
    } catch (error: any) {
      console.error("Error creating media:", error);
      res.status(400).json({ message: error.message || "Failed to create media" });
    }
  });

  app.delete("/api/media/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePartnerMedia(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting media:", error);
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  // Assessments
  app.get("/api/assessments", isAuthenticated, async (req, res) => {
    try {
      const assessments = await storage.getAllAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/export", isAuthenticated, async (req, res) => {
    try {
      const assessments = await storage.getAllAssessments();
      
      const csvHeader = "ID,Partner ID,Partner Name,Admin,Status,Rating,Blacklisted,Notes,Created At\n";
      const csvRows = assessments.map((a) =>
        [
          a.id,
          a.partnerId,
          `"${a.partner?.fullName || ""}"`,
          `"${a.admin}"`,
          `"${a.status || ""}"`,
          a.rating || "",
          a.blacklisted ? "Yes" : "No",
          `"${(a.notes || "").replace(/"/g, '""')}"`,
          a.createdAt ? new Date(a.createdAt).toISOString() : "",
        ].join(",")
      ).join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="assessments-${new Date().toISOString().split("T")[0]}.csv"`
      );
      res.send(csvHeader + csvRows);
    } catch (error) {
      console.error("Error exporting assessments:", error);
      res.status(500).json({ message: "Failed to export assessments" });
    }
  });

  app.get("/api/partners/:id/assessments", isAuthenticated, async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const assessments = await storage.getPartnerAssessments(partnerId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.post("/api/assessments", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAdminAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validatedData);
      res.status(201).json(assessment);
    } catch (error: any) {
      console.error("Error creating assessment:", error);
      res.status(400).json({ message: error.message || "Failed to create assessment" });
    }
  });

  // Tags
  app.get("/api/tags", isAuthenticated, async (req, res) => {
    try {
      const allTags = await storage.getAllTags();
      res.json(allTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error: any) {
      console.error("Error creating tag:", error);
      res.status(400).json({ message: error.message || "Failed to create tag" });
    }
  });

  app.delete("/api/tags/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTag(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });

  return httpServer;
}
