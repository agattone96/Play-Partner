# Database Setup & Connection Guide

This project uses **PostgreSQL** as its relational database. The default setup assumes a local Docker container, but you can also use a native local installation or a cloud provider.

## 1. Quick Start (Recommended)

We use `docker-compose` to manage the local database.

### Start Database

```bash
npm run db:start
# Equivalent to: docker-compose up -d
```

### Stop Database

```bash
npm run db:stop
# Equivalent to: docker-compose down
```

The database data is persisted in a Docker volume named `pgdata`.

---

## 2. Connection Settings based on `docker-compose`

If you need to connect via a GUI client (like TablePlus, DBeaver, or VS Code Database Client), use these settings:

| Setting            | Value                                                     |
| :----------------- | :-------------------------------------------------------- |
| **Connection URL** | `postgres://postgres:postgres@localhost:5432/playpartner` |
| **Host**           | `localhost`                                               |
| **Port**           | `5432`                                                    |
| **User**           | `postgres`                                                |
| **Password**       | `postgres`                                                |
| **Database Name**  | `playpartner`                                             |

---

## 3. Alternative Setups

### Option A: Local Native PostgreSQL

If you use Homebrew (`brew install postgresql`) or Postgres.app:

1. Ensure your local Postgres server is running on port `5432`.
2. Create a database named `playpartner`.
3. Create a user `postgres` with password `postgres` (or update `.env` to match your local credentials).
4. Do **not** run `npm run db:start` (since you're running it natively).

### Option B: Cloud Database (Neon, RDS, Supabase)

1. Provision your database.
2. Obtain the connection string (usually `postgres://user:password@host:port/dbname?sslmode=require`).
3. Update your `.env` file:
   ```bash
   DATABASE_URL=your_remote_connection_string
   ```
4. Run migrations:
   ```bash
   npm run db:push
   ```

---

## Troubleshooting

- **"Connection refused"**: Ensure Docker is running and `npm run db:start` has completed.
- **"Role does not exist"**: If using native Postgres, ensure the user specified in `DATABASE_URL` matches your system user.
- **Port Conflicts**: If port `5432` is already in use by another service, edit `docker-compose.yml` and `.env` to use a different port (e.g., `5433:5432`).
