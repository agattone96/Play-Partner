# Security Documentation

## Session Security

### Session Secret

The application uses a `SESSION_SECRET` to sign session cookies. This secret must be:

- **Long**: At least 32 bytes (64 hex characters).
- **Random**: Generated using a cryptographically secure random number generator.
- **Unique**: Distinct for every environment (Dev, Staging, Prod).
- **Secret**: Never committed to the repository.

### Configuration

- **Development**: You may use a weak key for local development, but the app will warn you.
- **Production**: The app **will fail to start** if the secret is weak or missing.

### Rotation Policy

Refer to `docs/SESSION_SECRET_ROTATION_SOP.md` for the procedure to rotate this key.

## Environment Variables

Environment variables are validated on startup using `server/env.ts`.

- `NODE_ENV`: logical environment (`development`, `production`).
- `SESSION_SECRET`: The signing key.
- `DATABASE_URL`: Connection string for PostgreSQL.

## CI/CD Security

- **Secret Scanning**: GitHub Actions runs `gitleaks` on every push to detect accidental commit of secrets.
- **Dependency Audit**: We monitor `npm audit` for critical vulnerabilities.

## Data Privacy & Retention

### Personal Identifiable Information (PII)

The application stores the following PII:

- **Users**: Name, Email, Profile Image (Google Auth).
- **Partners**: Name, City, Social Links, Notes (User-generated).

### Retention Policy

- **Active Data**: Retained indefinitely while the account is active.
- **Retired Partners**: Partners marked as "Retired" are retained for historical vetting context but hidden from the main active views.
- **Deleted Data**: "Hard delete" is performed immediately upon user request or via the "Delete Partner" action. No soft-delete buffers are currently implemented for partner records.
- **Backups**: Database backups are retained for 30 days.

### HTTPS Enforcement

All production traffic must be served over HTTPS. This is enforced at the edge (Cloudflare/Vercel/Replit) and via the `Secure` cookie attribute for sessions.
