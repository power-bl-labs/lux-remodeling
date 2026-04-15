import crypto from "node:crypto";
import QRCode from "qrcode";
import { generateSecret, generateURI, verifySync } from "otplib";

const APP_NAME = "Lux Remodeling Admin";
const TWO_FACTOR_LOGIN_WINDOW_MS = 10 * 60 * 1000;
const PASSWORD_RESET_WINDOW_MS = 60 * 60 * 1000;

function getSecuritySecret() {
  const secret =
    process.env.SECURITY_ENCRYPTION_KEY?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    throw new Error("SECURITY_ENCRYPTION_KEY or NEXTAUTH_SECRET is required.");
  }

  return secret;
}

function getCipherKey() {
  return crypto.scryptSync(getSecuritySecret(), "lux-remodeling-security", 32);
}

export function encryptSecret(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getCipherKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptSecret(value: string) {
  const [ivPart, tagPart, encryptedPart] = value.split(".");

  if (!ivPart || !tagPart || !encryptedPart) {
    throw new Error("Invalid encrypted secret format.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getCipherKey(),
    Buffer.from(ivPart, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, "base64url")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function hashToken(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function createRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function getTwoFactorLoginExpiry() {
  return new Date(Date.now() + TWO_FACTOR_LOGIN_WINDOW_MS);
}

export function getPasswordResetExpiry() {
  return new Date(Date.now() + PASSWORD_RESET_WINDOW_MS);
}

export function generateTotpSecret(email: string) {
  const secret = generateSecret();
  const otpauthUrl = generateURI({
    issuer: APP_NAME,
    label: email,
    secret,
  });

  return {
    secret,
    otpauthUrl,
  };
}

export async function createTotpQrDataUrl(otpauthUrl: string) {
  return QRCode.toDataURL(otpauthUrl, {
    margin: 1,
    width: 220,
  });
}

export function verifyTotpToken(secret: string, token: string) {
  return verifySync({
    secret,
    token: token.replace(/\s+/g, ""),
    epochTolerance: 30,
  });
}

function createRecoveryCode() {
  return crypto.randomBytes(5).toString("hex").toUpperCase();
}

export function createRecoveryCodes(count = 8) {
  const plainCodes = Array.from({ length: count }, () => createRecoveryCode());
  const hashedCodes = plainCodes.map((code) => hashToken(code));

  return {
    plainCodes,
    storedValue: JSON.stringify(hashedCodes),
  };
}

export function countRecoveryCodes(storedValue: string | null | undefined) {
  if (!storedValue) {
    return 0;
  }

  try {
    const parsed = JSON.parse(storedValue) as string[];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export function consumeRecoveryCode(input: string, storedValue: string | null | undefined) {
  if (!storedValue) {
    return {
      valid: false,
      nextValue: storedValue ?? null,
    };
  }

  try {
    const parsed = JSON.parse(storedValue) as string[];

    if (!Array.isArray(parsed)) {
      return {
        valid: false,
        nextValue: storedValue,
      };
    }

    const tokenHash = hashToken(input.trim().toUpperCase());
    const index = parsed.findIndex((item) => item === tokenHash);

    if (index === -1) {
      return {
        valid: false,
        nextValue: storedValue,
      };
    }

    const nextCodes = parsed.filter((_, itemIndex) => itemIndex !== index);

    return {
      valid: true,
      nextValue: JSON.stringify(nextCodes),
    };
  } catch {
    return {
      valid: false,
      nextValue: storedValue ?? null,
    };
  }
}

export function buildPasswordResetUrl(token: string) {
  const baseUrl = process.env.NEXTAUTH_URL?.trim();

  if (!baseUrl) {
    throw new Error("NEXTAUTH_URL is required to build password reset links.");
  }

  const url = new URL("/reset-password", baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}
