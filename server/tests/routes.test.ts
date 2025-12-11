
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import { registerRoutes } from "../routes";
import { createServer } from "http";
import { storage } from "../storage";

// 1. Mock Storage
vi.mock("../storage", () => ({
  storage: {
    getUser: vi.fn(),
    getUserByEmail: vi.fn(),
    getUserByMagicLinkToken: vi.fn(),
    updateUser: vi.fn(),
    getAllPartners: vi.fn(),
    getPartnerById: vi.fn(),
    createPartner: vi.fn(),
    updatePartner: vi.fn(),
    deletePartner: vi.fn(),
    getPartnerIntimacy: vi.fn(),
    upsertPartnerIntimacy: vi.fn(),
    getPartnerLogistics: vi.fn(),
    upsertPartnerLogistics: vi.fn(),
    getPartnerMedia: vi.fn(),
    createPartnerMedia: vi.fn(),
    deletePartnerMedia: vi.fn(),
    getAllAssessments: vi.fn(),
    getPartnerAssessments: vi.fn(),
    createAssessment: vi.fn(),
    getAllTags: vi.fn(),
    createTag: vi.fn(),
    deleteTag: vi.fn(),
    getDashboardData: vi.fn(),
  },
}));

// 2. Mock Auth Setup to avoid Passport/Session complexity
vi.mock("../auth", () => ({
  setupAuth: vi.fn(),
}));

// 3. Mock Auth Limiter to avoid waiting
vi.mock("express-rate-limit", () => ({
  default: () => (req: any, res: any, next: any) => next(),
}));

describe("API Routes & RBAC", () => {
  let app: Express;
  let mockUser: any = { role: "admin", id: 1 };
  let isAuthenticated = true;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());

    // Middleware to inject mock auth state
    app.use((req, res, next) => {
      req.isAuthenticated = () => isAuthenticated;
      req.user = mockUser;
      
      // Mock logIn/logOut for auth routes
      req.logIn = (user: any, cb: any) => cb(null);
      req.logout = (cb: any) => cb(null);
      
      next();
    });

    const server = createServer(app);
    await registerRoutes(server, app);
  });

  // --- FEATURE: AUTHENTICATION ---
  describe("Authentication", () => {
    it("should return 401 for protected routes if not authenticated", async () => {
      isAuthenticated = false;
      const res = await request(app).get("/api/partners");
      expect(res.status).toBe(401);
    });

    it("should allow access if authenticated", async () => {
      isAuthenticated = true;
      vi.mocked(storage.getAllPartners).mockResolvedValue([]);
      const res = await request(app).get("/api/partners");
      expect(res.status).toBe(200);
    });
  });

  // --- FEATURE: PARTNER MANAGEMENT & RBAC ---
  describe("Partner Management (RBAC)", () => {
    it("Admin can create a partner", async () => {
      isAuthenticated = true;
      mockUser = { role: "admin", id: 1 };
      
      const newPartner = { fullName: "Test Partner", status: "Active" };
      vi.mocked(storage.createPartner).mockResolvedValue({ id: 1, ...newPartner } as any);

      const res = await request(app)
        .post("/api/partners")
        .send(newPartner);

      expect(res.status).toBe(201);
      expect(storage.createPartner).toHaveBeenCalled();
    });

    it("Viewer CANNOT create a partner (RBAC)", async () => {
      isAuthenticated = true;
      mockUser = { role: "viewer", id: 2 }; // Standard user

      const res = await request(app)
        .post("/api/partners")
        .send({ name: "Malicious Partner" });

      expect(res.status).toBe(403); // Forbidden
      expect(storage.createPartner).not.toHaveBeenCalled();
    });

    it("Admin can delete a partner", async () => {
      isAuthenticated = true;
      mockUser = { role: "admin" };
      vi.mocked(storage.deletePartner).mockResolvedValue(true);

      const res = await request(app).delete("/api/partners/1");
      expect(res.status).toBe(204);
    });

    it("Viewer CANNOT delete a partner", async () => {
      isAuthenticated = true;
      mockUser = { role: "viewer" };

      const res = await request(app).delete("/api/partners/1");
      expect(res.status).toBe(403);
    });
  });

  // --- FEATURE: ASSESSMENTS & EXPORTS ---
  describe("Assessments & Exports", () => {
    it("Admin can export assessments", async () => {
      isAuthenticated = true;
      mockUser = { role: "admin" };
      
      vi.mocked(storage.getAllAssessments).mockResolvedValue([
        { id: 1, partnerId: 1, rating: 5, admin: "Admin", createdAt: new Date() } as any
      ]);

      const res = await request(app).get("/api/assessments/export");
      expect(res.status).toBe(200);
      expect(res.header["content-type"]).toContain("text/csv");
    });

    it("Viewer CANNOT export assessments", async () => {
      isAuthenticated = true;
      mockUser = { role: "viewer" };

      const res = await request(app).get("/api/assessments/export");
      expect(res.status).toBe(403);
    });
  });

  // --- FEATURE: DASHBOARD ---
  describe("Dashboard", () => {
    it("Authenticated user can view dashboard", async () => {
      isAuthenticated = true;
      mockUser = { role: "viewer" };
      const mockData = { totalPartners: 10, activePartners: 5, vettingQueue: [], riskList: [], conflictsList: [], recentPartners: [] };
      vi.mocked(storage.getDashboardData).mockResolvedValue(mockData as any);

      const res = await request(app).get("/api/dashboard");
      expect(res.status).toBe(200);
      expect(res.body.totalPartners).toBe(10);
    });
  });

  // --- FEATURE: HEALTH & VALIDATION ---
  describe("Health & Validation", () => {
    it("GET /api/health should return ok", async () => {
      const res = await request(app).get("/api/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });

    it("GET /api/partners/:id should return 400 for invalid ID", async () => {
      isAuthenticated = true;
      const res = await request(app).get("/api/partners/abc"); // Invalid ID
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid ID format");
    });

    it("DELETE /api/partners/:id should return 400 for invalid ID", async () => {
      isAuthenticated = true;
      mockUser = { role: "admin" };
      const res = await request(app).delete("/api/partners/invalid");
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid ID format");
    });
  });
});
