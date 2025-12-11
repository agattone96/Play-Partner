# Play-Partner

> **A secure, modern partner relationship management system.**

Play-Partner is a full-stack web application designed for tracking partners, assessments, and logistics in a privacy-focused manner. It features a modern "Glassmorphism" UI, robust security, and deep data modeling.

---

## 📚 Documentation Index

### Getting Started

- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)**: Setup, Installation, and Running the app.
- **[USER_MANUAL.md](./USER_MANUAL.md)**: How to use the features (Dashboard, Partners, Media).

### Architecture & Design

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System overview, Tech Stack, and Directory Structure.
- **[FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)**: Deep dive into the UI Theme, Components, and State.
- **[SCHEMA.md](./SCHEMA.md)**: Database Entity-Relationship Diagram (ERD).
- **[API_REFERENCE.md](./API_REFERENCE.md)**: Backend API Endpoints catalog.

### Security

- **[SECURITY.md](./SECURITY.md)**: Security Policy, Secret Management.
- **[SESSION_SECRET_ROTATION_SOP.md](./docs/SESSION_SECRET_ROTATION_SOP.md)**: Guide for rotating keys.

### Contributing

- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: How to contribute code.
- **[FAQ.md](./FAQ.md)**: Troubleshooting and Common Questions.
- **[LICENSE](./LICENSE)**: MIT License.

---

## Quick Start (Dev)

1.  **Clone**: `git clone ...`
2.  **Install**: `npm install`
3.  **Setup Env**: Copy `.env.example` to `.env`.
4.  **Run**: `npm run dev` (Starts DB, API, and Client).

## Key Features

- **Authentication**: Password & Magic Link login.
- **Security**: Role-based access, Session hardening, Secret scanning.
- **Partners**: Track status, logistics, and intimacy details securely.
- **Assessments**: Multi-admin rating system.
- **Modern UI**: Dark mode, Glass effects, Framer Motion animations.
