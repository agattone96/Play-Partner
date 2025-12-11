# Frequently Asked Questions (FAQ)

## General

**Q: What is Play-Partner?**
A: Play-Partner is a secure relationship management system designed for tracking partners, assessments, and logistics in a privacy-focused manner.

**Q: Is my data secure?**
A: Yes. The application uses strong industry-standard encryption for passwords (bcrypt), secure session management settings, and does not expose sensitive fields (like address/phone) without explicit user interaction (click-to-reveal).

## Troubleshooting

**Q: I can't log in.**
A:

1.  Check if you are using the correct credentials.
2.  If you are a new admin, ensure the server has seeded your account (check server logs).
3.  Try using the Magic Link option if you forgot your password.

**Q: The application says "Critical Security Failure" on startup.**
A: This means your `SESSION_SECRET` environment variable is either missing or too weak (shorter than 32 characters) in a production environment. See [SESSION_SECRET_ROTATION_SOP.md](docs/SESSION_SECRET_ROTATION_SOP.md) for how to fix this.

**Q: Images are not loading.**
A: Ensure the image URLs entered in the Media section are publicly accessible. The app does not currently host images locally; it stores URLs.

## Development

**Q: How do I run this locally?**
A: See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for full instructions. Briefly: `npm install` -> `npm run dev`.

**Q: Where is the database?**
A: We use a PostgreSQL database running in a Docker container. See `package.json` scripts (`db:start`).
