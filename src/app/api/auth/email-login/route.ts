import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import {
  createEmergencyAdminCookieValue,
  EMERGENCY_ADMIN_COOKIE_NAME,
  getEmergencyAdminCookieExpiry,
  getEmergencyAdminCookieOptions,
  matchesSeedAdminCredentials,
} from "@/lib/emergency-admin";
import { buildPublicUrl } from "@/lib/public-url";
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
    try {
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
    } catch (error) {
      console.error("Email login user lookup failed.", error);
    }
  }

  if (!authenticatedEmail) {
    const redirectUrl = buildPublicUrl(request, "/sign-in");
    redirectUrl.searchParams.set("error", "invalid");
    redirectUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const cookieValue = createEmergencyAdminCookieValue(authenticatedEmail);
  const expiresAt = getEmergencyAdminCookieExpiry(cookieValue);
  const redirectUrl = buildPublicUrl(request, callbackUrl);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  if (!expiresAt) {
    throw new Error("Failed to create emergency admin cookie.");
  }

  response.cookies.set(
    EMERGENCY_ADMIN_COOKIE_NAME,
    cookieValue,
    getEmergencyAdminCookieOptions(expiresAt),
  );

  return response;
}
