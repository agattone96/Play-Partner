# Features & Test Plan

## 1. Authentication

- **Login**: Authenticate with username/password.
- **Magic Link**: Request and verify magic link tokens.
- **Logout**: Terminate session.
- **Reset Password**: Force password change (if flagged) or self-initiated reset.
- **Rate Limiting**: Verify 10 requests/15min on auth routes.

## 2. Partner Management (Core)

- **List Partners**: Retrieve all partners (Admin/Viewer).
- **Create Partner (Admin)**: Create new record. (Verify RBAC).
- **Get Partner**: View detail by ID.
- **Update Partner (Admin)**: Modify details. (Verify RBAC).
- **Delete Partner (Admin)**: Remove record. (Verify RBAC).

## 3. Assessments

- **List Assessments**: View history.
- **Create Assessment (Admin)**: Add rating/status. (Verify RBAC).
- **Export (Admin)**: Download CSV. (Verify RBAC).

## 4. Tags

- **List Tags**: View available tags.
- **Create Tag (Admin)**: Add new taxonomy.
- **Delete Tag (Admin)**: Remove taxonomy.

## 5. System Health

- **Env Check**: Verify startup env vars.
- **Logging**: Verify JSON output format.
