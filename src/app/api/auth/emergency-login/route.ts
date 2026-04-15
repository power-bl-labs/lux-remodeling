import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import {
  createEmergencyAdminCookieValue,
  EMERGENCY_ADMIN_COOKIE_NAME,
  getEmergencyAdminCookieExpiry,
  getEmergencyAdminEmail,
  getEmergencyAdminCookieOptions,
  matchesSeedAdminCredentials,
} from "@/lib/emergency-admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  identifier: z.email().trim().toLowerCase(),
  password: z.string().min(8),
  callbackUrl: z.string().trim().optional(),
});

function sanitizeCallbackUrl(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin-demo";
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 400 });
    }

    let authenticatedEmail: string | null = null;

    if (matchesSeedAdminCredentials(parsed.data.identifier, parsed.data.password)) {
      authenticatedEmail = getEmergencyAdminEmail(parsed.data.identifier);
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: parsed.data.identifier,
        },
        select: {
          email: true,
          hashedPassword: true,
        },
      });

      if (user?.hashedPassword) {
        const isValid = await bcrypt.compare(parsed.data.password, user.hashedPassword);

        if (isValid) {
          authenticatedEmail = user.email;
        }
      }
    }

    if (!authenticatedEmail) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const cookieValue = createEmergencyAdminCookieValue(
      authenticatedEmail,
    );
    const expiresAt = getEmergencyAdminCookieExpiry(cookieValue);
    const response = NextResponse.json({
      ok: true,
      redirectUrl: sanitizeCallbackUrl(parsed.data.callbackUrl),
    });

    if (!expiresAt) {
      throw new Error("Failed to create emergency admin cookie.");
    }

    response.cookies.set(
      EMERGENCY_ADMIN_COOKIE_NAME,
      cookieValue,
      getEmergencyAdminCookieOptions(expiresAt),
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
