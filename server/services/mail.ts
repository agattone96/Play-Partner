import nodemailer from "nodemailer";

// In production, configure this with real SMTP settings
// For development, we'll just log to console if no transport is configured
const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export const mailService = {
  async sendMagicLink(email: string, token: string) {
    const link = `${process.env.APP_URL || "http://localhost:5000"}/api/magic-link/callback?token=${token}`;
    const message = `Login to PlayPartner: ${link}`;

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"PlayPartner" <noreply@playpartner.app>',
        to: email,
        subject: "Login to PlayPartner",
        text: message,
        html: `<p>Click here to login: <a href="${link}">${link}</a></p>`,
      });
    } else {
      console.log("==================================================");
      console.log(`[MailService] Magic Link for ${email}:`);
      console.log(link);
      console.log("==================================================");
    }
  },

  async sendPasswordReset(email: string, token: string) {
    // For now, we are treating magic links and forced resets slightly differently,
    // but the token mechanism is similar. If we had a specific "reset password" flow
    // that was initiated by the user, we'd send a link here.
    // However, the requirement is "Force password reset on first login", which happens AFTER login.
    // So this might not be strictly needed for the initial require-reset flow,
    // but good to have for "forgot password" later.
    const link = `${process.env.APP_URL || "http://localhost:5000"}/reset-password?token=${token}`;
    
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"PlayPartner" <noreply@playpartner.app>',
        to: email,
        subject: "Reset your PlayPartner Password",
        text: `Reset your password: ${link}`,
        html: `<p>Click here to reset your password: <a href="${link}">${link}</a></p>`,
      });
    } else {
      console.log("==================================================");
      console.log(`[MailService] Password Reset for ${email}:`);
      console.log(link);
      console.log("==================================================");
    }
  }
};
