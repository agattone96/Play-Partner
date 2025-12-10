CREATE TYPE "public"."admin_name_enum" AS ENUM('Allison', 'Roxanne');--> statement-breakpoint
CREATE TYPE "public"."body_build_enum" AS ENUM('Slim', 'Average', 'Athletic', 'Muscular', 'Stocky', 'Large/Big', 'Other');--> statement-breakpoint
CREATE TYPE "public"."referral_source_enum" AS ENUM('Allison', 'Roxanne');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('admin', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('New Prospect', 'Contacted', 'Ready for Vetting', 'Vetted', 'Active', 'On Pause', 'Retired', 'Do Not Engage');--> statement-breakpoint
CREATE TYPE "public"."tag_group_enum" AS ENUM('Vibe', 'Logistics', 'Risk', 'Admin');--> statement-breakpoint
CREATE TABLE "admin_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" integer NOT NULL,
	"admin" "admin_name_enum" NOT NULL,
	"status" "status_enum",
	"rating" integer,
	"blacklisted" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partner_intimacy" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" integer NOT NULL,
	"kinks" text[],
	"role" text[],
	"bedroom_style" text[],
	"sexual_orientation" varchar(100),
	"relationship_status" varchar(100),
	"appealing_characteristics" text[],
	"phallic_length" numeric(4, 1),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "partner_intimacy_partner_id_unique" UNIQUE("partner_id")
);
--> statement-breakpoint
CREATE TABLE "partner_logistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" integer NOT NULL,
	"discreet_dl" boolean DEFAULT false,
	"hosting" boolean DEFAULT false,
	"car" boolean DEFAULT false,
	"street_address" text,
	"phone_number" varchar(50),
	"city" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "partner_logistics_partner_id_unique" UNIQUE("partner_id")
);
--> statement-breakpoint
CREATE TABLE "partner_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" integer NOT NULL,
	"photo_face_url" text,
	"photo_body_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"nickname" varchar(100),
	"height" varchar(50),
	"body_build" "body_build_enum",
	"dob" timestamp,
	"city" varchar(100),
	"status" "status_enum" DEFAULT 'New Prospect',
	"referral_source" "referral_source_enum",
	"tags" text[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_name" varchar(100) NOT NULL,
	"tag_group" "tag_group_enum" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tags_tag_name_unique" UNIQUE("tag_name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"password" text,
	"is_password_reset_required" boolean DEFAULT false,
	"magic_link_token" text,
	"magic_link_expires_at" timestamp,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" "role_enum" DEFAULT 'viewer',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_assessments" ADD CONSTRAINT "admin_assessments_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_intimacy" ADD CONSTRAINT "partner_intimacy_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_logistics" ADD CONSTRAINT "partner_logistics_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_media" ADD CONSTRAINT "partner_media_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");