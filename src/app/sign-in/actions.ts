"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createEmergencyAdminCookieValue,
  getEmergencyAdminCookieOptions,
  getEmergencyAdminEmail,
  matchesSeedAdminCredentials,
} from "@/lib/emergency-admin";
import { prisma } from "@/lib/prisma";

function sanitizeCallbackUrl(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin-demo";
  }

  return value;
}

export async function directAdminSignInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = sanitizeCallbackUrl(String(formData.get("callbackUrl") ?? ""));

  let authenticatedEmail: string | null = null;

  if (matchesSeedAdminCredentials(email, password)) {
    authenticatedEmail = getEmergencyAdminEmail(email);
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
    redirect(`/sign-in?error=invalid&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const cookieValue = createEmergencyAdminCookieValue(authenticatedEmail);
  const [, expiresAtRaw] = cookieValue.split(".");
  const cookieStore = await cookies();

  cookieStore.set(
    "lux_admin_emergency",
    cookieValue,
    getEmergencyAdminCookieOptions(Number(expiresAtRaw)),
  );

  redirect(callbackUrl);
}
