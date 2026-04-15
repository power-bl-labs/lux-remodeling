import crypto from "node:crypto";
import { UserRole } from "@prisma/client";
import type { Session } from "next-auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const EMERGENCY_ADMIN_COOKIE_NAME = "lux_admin_emergency";

const EMERGENCY_ADMIN_TTL_MS = 1000 * 60 * 60 * 12;

function getEmergencyAdminSecret() {
  const secret =
    process.env.SECURITY_ENCRYPTION_KEY?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    throw new Error("SECURITY_ENCRYPTION_KEY or NEXTAUTH_SECRET is required.");
  }

  return secret;
}

function signEmergencyPayload(payload: string) {
  return crypto
    .createHmac("sha256", getEmergencyAdminSecret())
    .update(payload)
    .digest("base64url");
}

function getSeedAdminEmail() {
  return process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
}

export function getEmergencyAdminEmail(identifier?: string) {
  const normalizedIdentifier = identifier?.trim().toLowerCase();
  return normalizedIdentifier || getSeedAdminEmail() || "admin@luxremodeling.com";
}

export function matchesSeedAdminCredentials(email: string, password: string) {
  const seedEmail = getSeedAdminEmail();
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!seedEmail || !seedPassword) {
    return false;
  }

  return email === seedEmail && password === seedPassword;
}

export function createEmergencyAdminCookieValue(email: string) {
  const safeEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + EMERGENCY_ADMIN_TTL_MS;
  const payload = `${safeEmail}.${expiresAt}`;
  const signature = signEmergencyPayload(payload);
  return `${payload}.${signature}`;
}

export function readEmergencyAdminCookieValue(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const [email, expiresAtRaw, signature] = value.split(".");

  if (!email || !expiresAtRaw || !signature) {
    return null;
  }

  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return null;
  }

  const payload = `${email}.${expiresAtRaw}`;
  const expectedSignature = signEmergencyPayload(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  return {
    email,
    expiresAt,
  };
}

export function getEmergencyAdminCookieOptions(expiresAt?: number | Date) {
  const nextExpiresAt =
    typeof expiresAt === "number"
      ? new Date(expiresAt)
      : expiresAt instanceof Date
        ? expiresAt
        : new Date(Date.now() + EMERGENCY_ADMIN_TTL_MS);

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: nextExpiresAt,
  };
}

export async function getEmergencyAdminSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const emergencyCookie = cookieStore.get(EMERGENCY_ADMIN_COOKIE_NAME)?.value;
  const parsed = readEmergencyAdminCookieValue(emergencyCookie);

  if (!parsed) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return {
    expires: new Date(parsed.expiresAt).toISOString(),
    user: {
      id: user?.id ?? `emergency:${parsed.email}`,
      email: parsed.email,
      name: user?.name ?? process.env.SEED_ADMIN_NAME?.trim() ?? "Lux Admin",
      role: user?.role ?? UserRole.ADMIN,
    },
  };
}
