# Contributing to Play-Partner

Thank you for your interest in contributing!

## Getting Started

1.  Read the [Architecture Overview](ARCHITECTURE.md) to understand the system.
2.  Follow the [Developer Guide](DEVELOPER_GUIDE.md) to set up your environment.

## Workflow

1.  **Fork & Clone**: Fork the repo and clone it locally.
2.  **Branch**: Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  **Code**: Write code that matches the existing style.
    - Use Functional React Components.
    - Use Tailwind utility classes (avoid custom CSS if possible).
    - Ensure robust typing (no `any`).
4.  **Test**:
    - Run `npm run check` to verify types.
    - Run `npm run check-env` to verify environment logic.
5.  **Commit**: Keep commit messages clear and concise.
6.  **Push & PR**: Push to your fork and submit a Pull Request.

## Coding Standards

- **Linting**: We use ESLint and Prettier. Ensure your editor runs these on save.
- **Security**: Do not commit secrets. Run `gitleaks detect` if you have it installed locally (CI will catch it otherwise).
- **Database**: All schema changes must use Drizzle migrations (`npm run db:generate`).

## Reporting Issues

Please open an Issue on GitHub for any bugs or feature requests. Include reproduction steps for bugs.
