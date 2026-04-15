import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createEmergencyAdminCookieValue,
  EMERGENCY_ADMIN_COOKIE_NAME,
  getEmergencyAdminEmail,
  getEmergencyAdminCookieOptions,
  matchesSimpleAdminCredentials,
} from "@/lib/emergency-admin";

const schema = z.object({
  identifier: z.string().trim().min(2).toLowerCase(),
  password: z.string().min(6),
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

    if (!matchesSimpleAdminCredentials(parsed.data.identifier, parsed.data.password)) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const cookieValue = createEmergencyAdminCookieValue(
      getEmergencyAdminEmail(parsed.data.identifier),
    );
    const [, expiresAtRaw] = cookieValue.split(".");
    const expiresAt = Number(expiresAtRaw);
    const response = NextResponse.json({
      ok: true,
      redirectUrl: sanitizeCallbackUrl(parsed.data.callbackUrl),
    });

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
