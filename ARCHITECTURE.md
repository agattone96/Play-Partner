# Architecture & System Design

## 1. System Overview

Play-Partner is a full-stack web application designed for relationship management and partner tracking. It uses a monolithic repository structure with a separated frontend and backend that communicate via a REST API.

### Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI (`client/`)
- **Backend**: Node.js, Express.js, TypeScript (`server/`)
- **Database**: PostgreSQL 16 (Relational Data)
- **ORM**: Drizzle ORM (Type-safe SQL)
- **Authentication**: Passport.js (Sessions backed by Postgres)

## 2. Directory Structure

- `client/`: React Frontend application.
  - `src/components/`: Reusable UI components.
  - `src/pages/`: Route-level views.
  - `src/hooks/`: Custom React hooks (e.g., `useAuth`).
  - `src/lib/`: Utilities and API client (`queryClient`).
- `server/`: Express Backend application.
  - `routes.ts`: API Endpoint definitions.
  - `auth.ts`: Passport configuration and Session setup.
  - `storage.ts`: Database access layer (Drizzle queries).
  - `env.ts`: Runtime environment validation.
- `shared/`: Code shared between client and server.
  - `schema.ts`: Drizzle Table definitions, Zod schemas, and TypeScript interfaces.
- `scripts/`: Maintenance scripts (backups, validation).

## 3. Data Architecture (ERD)

The database schema is defined in `shared/schema.ts`.

### Core Entities

- **Users (`users`)**: Authenticated admins.
  - Support for Password Login and Magic Links.
  - Fields: `email`, `password` (hashed), `role`, `magicLinkToken`.

- **Partners (`partners`)**: The central entity.
  - Represents a person/prospect.
  - Fields: `fullName`, `status` (Enum), `referralSource`, `tags`.

### Partner Extensions (1:1)

- **PartnerIntimacy (`partner_intimacy`)**: Sensitive/Private details.
  - Fields: `kinks`, `role`, `sexualOrientation`, `phallicLength`.
  - Linked via `partnerId`.

- **PartnerLogistics (`partner_logistics`)**: Practical details.
  - Fields: `streetAddress`, `phoneNumber`, `hosting` (boolean), `car`.
  - Linked via `partnerId`.

### Partner Extensions (1:N)

- **PartnerMedia (`partner_media`)**: Photos/Files.
  - Fields: `photoFaceUrl`, `photoBodyUrl`.

- **AdminAssessments (`admin_assessments`)**: Admin reviews/ratings.
  - Fields: `admin` (Name), `rating` (1-5), `blacklisted`, `notes`.
  - Allows multiple admins (Allison/Roxanne) to rate the same partner independently.

## 4. Request Lifecycle

1.  **Client Request**: React Component (via `useQuery`/`useMutation`) makes a fetch request to `/api/*`.
2.  **Reverse Proxy**: In Dev, Vite proxies `/api` to Express (`localhost:5000`). In Prod, Express serves static frontend files and API.
3.  **Middleware**:
    - `helmet`: Security headers.
    - `rateLimit`: Brute force protection.
    - `session`: Validates cookie ID against `sessions` table in DB.
    - `passport`: Deserializes user from session.
4.  **Route Handler**: `server/routes.ts` validates input using Zod schemas (from `shared/schema.ts`).
5.  **Storage Layer**: `server/storage.ts` executes SQL via Drizzle ORM.
6.  **Response**: JSON data returned to client.

## 5. Security Architecture

- **Session Management**: Server-side sessions stored in Postgres (`connect-pg-simple`). Cookies are `HttpOnly` and `Secure` (in prod).
- **Environment Validation**: Server refuses to start (`server/env.ts`) if vital secrets are missing or weak.
- **Secret Scanning**: GitHub Actions workflow prevents secret leakage.
- **Type Safety**: End-to-end type safety via TypeScript and shared Zod schemas prevents data mismatch and injection flaws.
