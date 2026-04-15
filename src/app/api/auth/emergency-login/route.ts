import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createEmergencyAdminCookieValue,
  EMERGENCY_ADMIN_COOKIE_NAME,
  getEmergencyAdminCookieOptions,
  matchesSeedAdminCredentials,
} from "@/lib/emergency-admin";

const schema = z.object({
  email: z.email().trim().toLowerCase(),
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

    if (!matchesSeedAdminCredentials(parsed.data.email, parsed.data.password)) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const cookieValue = createEmergencyAdminCookieValue(parsed.data.email);
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
