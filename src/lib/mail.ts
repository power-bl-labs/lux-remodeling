import nodemailer from "nodemailer";

function getTransportConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
  };
}

export function isMailConfigured() {
  return Boolean(getTransportConfig() && process.env.MAIL_FROM?.trim());
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  const transportConfig = getTransportConfig();
  const from = process.env.MAIL_FROM?.trim();

  if (!transportConfig || !from) {
    throw new Error("SMTP email is not configured.");
  }

  const transporter = nodemailer.createTransport(transportConfig);

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your Lux Remodeling admin password",
    text: [
      "A password reset was requested for your Lux Remodeling admin account.",
      "",
      "Use this link to choose a new password:",
      resetUrl,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>A password reset was requested for your Lux Remodeling admin account.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}
