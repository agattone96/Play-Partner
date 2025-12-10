import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  serial,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: text("password"),
  isPasswordResetRequired: boolean("is_password_reset_required").default(false),
  magicLinkToken: text("magic_link_token"),
  magicLinkExpiresAt: timestamp("magic_link_expires_at"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("viewer"), // "admin" or "viewer"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Dropdown options - stored as constants for type safety
export const BODY_BUILD_OPTIONS = [
  "Slim",
  "Average",
  "Athletic",
  "Muscular",
  "Stocky",
  "Large/Big",
  "Other",
] as const;

export const STATUS_OPTIONS = [
  "New Prospect",
  "Contacted",
  "Ready for Vetting",
  "Vetted",
  "Active",
  "On Pause",
  "Retired",
  "Do Not Engage",
] as const;

export const REFERRAL_SOURCE_OPTIONS = ["Allison", "Roxanne"] as const;

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export const TAG_GROUP_OPTIONS = [
  "Vibe",
  "Logistics",
  "Risk",
  "Admin",
] as const;

export const ADMIN_OPTIONS = ["Allison", "Roxanne"] as const;

// Partners table - core hub
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  nickname: varchar("nickname", { length: 100 }),
  height: varchar("height", { length: 50 }),
  bodyBuild: varchar("body_build", { length: 50 }),
  dob: timestamp("dob"),
  city: varchar("city", { length: 100 }),
  status: varchar("status", { length: 50 }).default("New Prospect"),
  referralSource: varchar("referral_source", { length: 50 }),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const partnersRelations = relations(partners, ({ one, many }) => ({
  intimacy: one(partnerIntimacy, {
    fields: [partners.id],
    references: [partnerIntimacy.partnerId],
  }),
  logistics: one(partnerLogistics, {
    fields: [partners.id],
    references: [partnerLogistics.partnerId],
  }),
  media: many(partnerMedia),
  assessments: many(adminAssessments),
}));

// Partner Intimacy table (1:1 with partners)
export const partnerIntimacy = pgTable("partner_intimacy", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" })
    .unique(),
  kinks: text("kinks").array(),
  role: text("role").array(),
  bedroomStyle: text("bedroom_style").array(),
  sexualOrientation: varchar("sexual_orientation", { length: 100 }),
  relationshipStatus: varchar("relationship_status", { length: 100 }),
  appealingCharacteristics: text("appealing_characteristics").array(),
  phallicLength: numeric("phallic_length", { precision: 4, scale: 1 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const partnerIntimacyRelations = relations(
  partnerIntimacy,
  ({ one }) => ({
    partner: one(partners, {
      fields: [partnerIntimacy.partnerId],
      references: [partners.id],
    }),
  })
);

// Partner Logistics table (1:1 with partners)
export const partnerLogistics = pgTable("partner_logistics", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" })
    .unique(),
  discreetDl: boolean("discreet_dl").default(false),
  hosting: boolean("hosting").default(false),
  car: boolean("car").default(false),
  streetAddress: text("street_address"), // sensitive
  phoneNumber: varchar("phone_number", { length: 50 }), // sensitive
  city: varchar("city", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const partnerLogisticsRelations = relations(
  partnerLogistics,
  ({ one }) => ({
    partner: one(partners, {
      fields: [partnerLogistics.partnerId],
      references: [partners.id],
    }),
  })
);

// Partner Media table (1:many with partners)
export const partnerMedia = pgTable("partner_media", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" }),
  photoFaceUrl: text("photo_face_url"),
  photoBodyUrl: text("photo_body_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const partnerMediaRelations = relations(partnerMedia, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerMedia.partnerId],
    references: [partners.id],
  }),
}));

// Admin Assessments table (1:many with partners)
export const adminAssessments = pgTable("admin_assessments", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" }),
  admin: varchar("admin", { length: 50 }).notNull(), // "Allison" or "Roxanne"
  status: varchar("status", { length: 50 }),
  rating: integer("rating"),
  blacklisted: boolean("blacklisted").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminAssessmentsRelations = relations(
  adminAssessments,
  ({ one }) => ({
    partner: one(partners, {
      fields: [adminAssessments.partnerId],
      references: [partners.id],
    }),
  })
);

// Tags table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  tagName: varchar("tag_name", { length: 100 }).notNull().unique(),
  tagGroup: varchar("tag_group", { length: 50 }).notNull(), // Vibe, Logistics, Risk, Admin
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerIntimacySchema = createInsertSchema(
  partnerIntimacy
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerLogisticsSchema = createInsertSchema(
  partnerLogistics
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerMediaSchema = createInsertSchema(partnerMedia).omit({
  id: true,
  createdAt: true,
});

export const insertAdminAssessmentSchema = createInsertSchema(
  adminAssessments
).omit({
  id: true,
  createdAt: true,
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

export type InsertPartnerIntimacy = z.infer<typeof insertPartnerIntimacySchema>;
export type PartnerIntimacy = typeof partnerIntimacy.$inferSelect;

export type InsertPartnerLogistics = z.infer<
  typeof insertPartnerLogisticsSchema
>;
export type PartnerLogistics = typeof partnerLogistics.$inferSelect;

export type InsertPartnerMedia = z.infer<typeof insertPartnerMediaSchema>;
export type PartnerMedia = typeof partnerMedia.$inferSelect;

export type InsertAdminAssessment = z.infer<typeof insertAdminAssessmentSchema>;
export type AdminAssessment = typeof adminAssessments.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

// Extended Partner type with computed fields
export interface PartnerWithComputed extends Partner {
  intimacy?: PartnerIntimacy | null;
  logistics?: PartnerLogistics | null;
  media?: PartnerMedia[];
  assessments?: AdminAssessment[];
  avgRating?: number | null;
  latestAllisonStatus?: string | null;
  latestRoxanneStatus?: string | null;
  effectiveStatus: string;
  riskFlag: boolean;
  conflictFlag: boolean;
  isBlacklisted: boolean;
}
