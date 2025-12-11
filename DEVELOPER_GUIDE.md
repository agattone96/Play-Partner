# Developer Guide

## 1. Prerequisites

- **Node.js**: v20 or higher.
- **Docker**: For running the PostgreSQL database.
- **VS Code**: Recommended editor (with ESLint/Prettier extensions).

## 2. Setup

1.  **Cloning**:

    ```bash
    git clone <repo-url>
    cd play-partner
    ```

2.  **Dependencies**:

    ```bash
    npm install
    ```

3.  **Environment**:
    - Copy `.env.example` to `.env`.
    - `SESSION_SECRET` can be left as the default weak key for **local development ONLY**.

4.  **Database**:
    Start the database container:
    ```bash
    npm run db:start
    ```

## 3. Running the Application

Start the full stack (Database + API + Frontend):

```bash
npm run dev
```

- Access App: `http://localhost:5002`
- This command verifies environment variables and seed data automatically.

## 4. Common Workflows

### Modifying the Database Schema

1.  Edit `shared/schema.ts`.
2.  Generate a new migration:
    ```bash
    npm run db:generate
    ```
3.  Apply the migration:
    ```bash
    npm run db:migrate
    ```

### Adding a New API Endpoint

1.  Define Zod schema for input/output in `shared/schema.ts` (if needed).
2.  Add database query method in `server/storage.ts`.
3.  Add route handler in `server/routes.ts`.
4.  Add Frontend types match automatically via shared schema.

### Code Quality

- **Linting**: `npx eslint .` (Automatically runs in CI).
- **Type Check**: `npm run check`.
- **Environment Check**: `npm run check-env` (Ensures `.env` is valid).

## 5. Deployment

### Production Build

1.  **Build**:

    ```bash
    npm run build
    ```

    This compiles the React frontend to `dist/public` and the Node backend to `dist/`.

2.  **Start**:
    ```bash
    npm start
    ```
    Ensure `NODE_ENV=production` and `SESSION_SECRET` is strong.

### Environment Variables (Production)

- `DATABASE_URL`: Production Postgres connection string.
- `SESSION_SECRET`: **Must** be Strong (>= 32 bytes).
- `PORT`: Port to listen on (default 5000).
