import {
  users,
  partners,
  partnerIntimacy,
  partnerLogistics,
  partnerMedia,
  adminAssessments,
  tags,
  type User,
  type UpsertUser,
  type Partner,
  type InsertPartner,
  type PartnerIntimacy,
  type InsertPartnerIntimacy,
  type PartnerLogistics,
  type InsertPartnerLogistics,
  type PartnerMedia,
  type InsertPartnerMedia,
  type AdminAssessment,
  type InsertAdminAssessment,
  type Tag,
  type InsertTag,
  type PartnerWithComputed,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Partner operations
  getAllPartners(): Promise<PartnerWithComputed[]>;
  getPartnerById(id: number): Promise<PartnerWithComputed | undefined>;
  createPartner(data: InsertPartner): Promise<Partner>;
  updatePartner(id: number, data: Partial<InsertPartner>): Promise<Partner | undefined>;
  deletePartner(id: number): Promise<boolean>;

  // Partner Intimacy operations
  getPartnerIntimacy(partnerId: number): Promise<PartnerIntimacy | undefined>;
  upsertPartnerIntimacy(data: InsertPartnerIntimacy): Promise<PartnerIntimacy>;

  // Partner Logistics operations
  getPartnerLogistics(partnerId: number): Promise<PartnerLogistics | undefined>;
  upsertPartnerLogistics(data: InsertPartnerLogistics): Promise<PartnerLogistics>;

  // Partner Media operations
  getPartnerMedia(partnerId: number): Promise<PartnerMedia[]>;
  createPartnerMedia(data: InsertPartnerMedia): Promise<PartnerMedia>;
  deletePartnerMedia(id: number): Promise<boolean>;

  // Assessment operations
  getAllAssessments(): Promise<(AdminAssessment & { partner?: Partner })[]>;
  getPartnerAssessments(partnerId: number): Promise<AdminAssessment[]>;
  createAssessment(data: InsertAdminAssessment): Promise<AdminAssessment>;

  // Tag operations
  getAllTags(): Promise<Tag[]>;
  createTag(data: InsertTag): Promise<Tag>;
  deleteTag(id: number): Promise<boolean>;

  // Dashboard operations
  getDashboardData(): Promise<{
    totalPartners: number;
    activePartners: number;
    vettingQueue: PartnerWithComputed[];
    riskList: PartnerWithComputed[];
    conflictsList: PartnerWithComputed[];
    recentPartners: PartnerWithComputed[];
  }>;
}

// Helper to compute fields for a partner
function computePartnerFields(
  partner: Partner,
  intimacy?: PartnerIntimacy | null,
  logistics?: PartnerLogistics | null,
  media?: PartnerMedia[],
  assessments?: AdminAssessment[],
  allTags?: Tag[]
): PartnerWithComputed {
  // Calculate average rating
  const ratingsWithValues = assessments?.filter((a) => a.rating !== null) || [];
  const avgRating =
    ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, a) => sum + (a.rating || 0), 0) /
        ratingsWithValues.length
      : null;

  // Get latest admin statuses
  const sortedAssessments = [...(assessments || [])].sort(
    (a, b) =>
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );

  const latestAllisonAssessment = sortedAssessments.find(
    (a) => a.admin === "Allison"
  );
  const latestRoxanneAssessment = sortedAssessments.find(
    (a) => a.admin === "Roxanne"
  );

  const latestAllisonStatus = latestAllisonAssessment?.status || null;
  const latestRoxanneStatus = latestRoxanneAssessment?.status || null;

  // Check if blacklisted
  const isBlacklisted = assessments?.some((a) => a.blacklisted) || false;

  // Check for risk tags
  const riskTags = allTags?.filter((t) => t.tagGroup === "Risk") || [];
  const riskTagNames = riskTags.map((t) => t.tagName.toLowerCase());
  const hasRiskTags =
    partner.tags?.some((t) => riskTagNames.includes(t.toLowerCase())) || false;

  // Risk flag
  const riskFlag = isBlacklisted || hasRiskTags;

  // Conflict flag - admins disagree on status
  const conflictFlag =
    latestAllisonStatus !== null &&
    latestRoxanneStatus !== null &&
    latestAllisonStatus !== latestRoxanneStatus;

  // Effective status logic
  let effectiveStatus = partner.status || "New Prospect";

  if (
    isBlacklisted ||
    latestAllisonStatus === "Do Not Engage" ||
    latestRoxanneStatus === "Do Not Engage"
  ) {
    effectiveStatus = "Do Not Engage";
  } else if (latestAllisonStatus) {
    effectiveStatus = latestAllisonStatus;
  } else if (latestRoxanneStatus) {
    effectiveStatus = latestRoxanneStatus;
  }

  return {
    ...partner,
    intimacy: intimacy || null,
    logistics: logistics || null,
    media: media || [],
    assessments: assessments || [],
    avgRating,
    latestAllisonStatus,
    latestRoxanneStatus,
    effectiveStatus,
    riskFlag,
    conflictFlag,
    isBlacklisted,
  };
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Partner operations
  async getAllPartners(): Promise<PartnerWithComputed[]> {
    const allPartners = await db.select().from(partners).orderBy(desc(partners.createdAt));
    const allIntimacy = await db.select().from(partnerIntimacy);
    const allLogistics = await db.select().from(partnerLogistics);
    const allMedia = await db.select().from(partnerMedia);
    const allAssessments = await db.select().from(adminAssessments);
    const allTags = await db.select().from(tags);

    return allPartners.map((partner) => {
      const intimacy = allIntimacy.find((i) => i.partnerId === partner.id);
      const logistics = allLogistics.find((l) => l.partnerId === partner.id);
      const media = allMedia.filter((m) => m.partnerId === partner.id);
      const assessmentsList = allAssessments.filter(
        (a) => a.partnerId === partner.id
      );

      return computePartnerFields(
        partner,
        intimacy,
        logistics,
        media,
        assessmentsList,
        allTags
      );
    });
  }

  async getPartnerById(id: number): Promise<PartnerWithComputed | undefined> {
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.id, id));

    if (!partner) return undefined;

    const [intimacy] = await db
      .select()
      .from(partnerIntimacy)
      .where(eq(partnerIntimacy.partnerId, id));
    const [logistics] = await db
      .select()
      .from(partnerLogistics)
      .where(eq(partnerLogistics.partnerId, id));
    const media = await db
      .select()
      .from(partnerMedia)
      .where(eq(partnerMedia.partnerId, id));
    const assessments = await db
      .select()
      .from(adminAssessments)
      .where(eq(adminAssessments.partnerId, id))
      .orderBy(desc(adminAssessments.createdAt));
    const allTags = await db.select().from(tags);

    return computePartnerFields(
      partner,
      intimacy,
      logistics,
      media,
      assessments,
      allTags
    );
  }

  async createPartner(data: InsertPartner): Promise<Partner> {
    const [partner] = await db.insert(partners).values(data).returning();
    return partner;
  }

  async updatePartner(
    id: number,
    data: Partial<InsertPartner>
  ): Promise<Partner | undefined> {
    const [partner] = await db
      .update(partners)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(partners.id, id))
      .returning();
    return partner;
  }

  async deletePartner(id: number): Promise<boolean> {
    const result = await db.delete(partners).where(eq(partners.id, id));
    return true;
  }

  // Partner Intimacy operations
  async getPartnerIntimacy(
    partnerId: number
  ): Promise<PartnerIntimacy | undefined> {
    const [intimacy] = await db
      .select()
      .from(partnerIntimacy)
      .where(eq(partnerIntimacy.partnerId, partnerId));
    return intimacy;
  }

  async upsertPartnerIntimacy(
    data: InsertPartnerIntimacy
  ): Promise<PartnerIntimacy> {
    const [intimacy] = await db
      .insert(partnerIntimacy)
      .values(data)
      .onConflictDoUpdate({
        target: partnerIntimacy.partnerId,
        set: { ...data, updatedAt: new Date() },
      })
      .returning();
    return intimacy;
  }

  // Partner Logistics operations
  async getPartnerLogistics(
    partnerId: number
  ): Promise<PartnerLogistics | undefined> {
    const [logistics] = await db
      .select()
      .from(partnerLogistics)
      .where(eq(partnerLogistics.partnerId, partnerId));
    return logistics;
  }

  async upsertPartnerLogistics(
    data: InsertPartnerLogistics
  ): Promise<PartnerLogistics> {
    const [logistics] = await db
      .insert(partnerLogistics)
      .values(data)
      .onConflictDoUpdate({
        target: partnerLogistics.partnerId,
        set: { ...data, updatedAt: new Date() },
      })
      .returning();
    return logistics;
  }

  // Partner Media operations
  async getPartnerMedia(partnerId: number): Promise<PartnerMedia[]> {
    return db
      .select()
      .from(partnerMedia)
      .where(eq(partnerMedia.partnerId, partnerId));
  }

  async createPartnerMedia(data: InsertPartnerMedia): Promise<PartnerMedia> {
    const [media] = await db.insert(partnerMedia).values(data).returning();
    return media;
  }

  async deletePartnerMedia(id: number): Promise<boolean> {
    await db.delete(partnerMedia).where(eq(partnerMedia.id, id));
    return true;
  }

  // Assessment operations
  async getAllAssessments(): Promise<
    (AdminAssessment & { partner?: Partner })[]
  > {
    const allAssessments = await db
      .select()
      .from(adminAssessments)
      .orderBy(desc(adminAssessments.createdAt));
    const allPartners = await db.select().from(partners);

    return allAssessments.map((assessment) => ({
      ...assessment,
      partner: allPartners.find((p) => p.id === assessment.partnerId),
    }));
  }

  async getPartnerAssessments(partnerId: number): Promise<AdminAssessment[]> {
    return db
      .select()
      .from(adminAssessments)
      .where(eq(adminAssessments.partnerId, partnerId))
      .orderBy(desc(adminAssessments.createdAt));
  }

  async createAssessment(data: InsertAdminAssessment): Promise<AdminAssessment> {
    const [assessment] = await db
      .insert(adminAssessments)
      .values(data)
      .returning();
    return assessment;
  }

  // Tag operations
  async getAllTags(): Promise<Tag[]> {
    return db.select().from(tags).orderBy(tags.tagGroup, tags.tagName);
  }

  async createTag(data: InsertTag): Promise<Tag> {
    const [tag] = await db.insert(tags).values(data).returning();
    return tag;
  }

  async deleteTag(id: number): Promise<boolean> {
    await db.delete(tags).where(eq(tags.id, id));
    return true;
  }

  // Dashboard operations
  async getDashboardData() {
    const allPartners = await this.getAllPartners();

    const totalPartners = allPartners.length;
    const activePartners = allPartners.filter(
      (p) => p.effectiveStatus === "Active"
    ).length;

    const vettingQueue = allPartners.filter(
      (p) => p.effectiveStatus === "Ready for Vetting"
    );

    const riskList = allPartners.filter((p) => p.riskFlag);

    const conflictsList = allPartners.filter((p) => p.conflictFlag);

    const recentPartners = allPartners.slice(0, 10);

    return {
      totalPartners,
      activePartners,
      vettingQueue,
      riskList,
      conflictsList,
      recentPartners,
    };
  }
}

export const storage = new DatabaseStorage();
