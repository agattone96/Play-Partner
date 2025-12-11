# Play-Partner

A secure, modern application for partner relationship management.

## Getting Started

1.  Copy `.env.example` to `.env`
2.  `npm install`
3.  `npm run dev`

## Security

This project enforces strict security practices.

- **Secrets**: Session secrets must be strong and unique per environment.
- **Validation**: The app will not start in production with weak configuration.

See [SECURITY.md](./SECURITY.md) for detailed security policies and [docs/SESSION_SECRET_ROTATION_SOP.md](./docs/SESSION_SECRET_ROTATION_SOP.md) for secret rotation.
