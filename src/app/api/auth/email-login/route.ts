import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  createEmergencyAdminCookieValue,
  EMERGENCY_ADMIN_COOKIE_NAME,
  getEmergencyAdminCookieOptions,
  matchesSeedAdminCredentials,
} from "@/lib/emergency-admin";
import { prisma } from "@/lib/prisma";

function sanitizeCallbackUrl(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin-demo";
  }

  return value;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = sanitizeCallbackUrl(String(formData.get("callbackUrl") ?? ""));

  let authenticatedEmail: string | null = null;

  if (matchesSeedAdminCredentials(email, password)) {
    authenticatedEmail = email;
  } else {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        hashedPassword: true,
      },
    });

    if (user?.hashedPassword) {
      const isValid = await bcrypt.compare(password, user.hashedPassword);

      if (isValid) {
        authenticatedEmail = user.email;
      }
    }
  }

  if (!authenticatedEmail) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("error", "invalid");
    redirectUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const cookieValue = createEmergencyAdminCookieValue(authenticatedEmail);
  const [, expiresAtRaw] = cookieValue.split(".");
  const redirectUrl = new URL(callbackUrl, request.url);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  response.cookies.set(
    EMERGENCY_ADMIN_COOKIE_NAME,
    cookieValue,
    getEmergencyAdminCookieOptions(Number(expiresAtRaw)),
  );

  return response;
}
