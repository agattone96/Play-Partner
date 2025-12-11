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
