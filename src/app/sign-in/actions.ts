"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createEmergencyAdminCookieValue,
  getEmergencyAdminCookieOptions,
  getEmergencyAdminEmail,
  matchesSimpleAdminCredentials,
} from "@/lib/emergency-admin";

function sanitizeCallbackUrl(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin-demo";
  }

  return value;
}

export async function directAdminSignInAction(formData: FormData) {
  const identifier = String(formData.get("login") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = sanitizeCallbackUrl(String(formData.get("callbackUrl") ?? ""));

  if (!matchesSimpleAdminCredentials(identifier, password)) {
    redirect(`/sign-in?error=invalid&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const email = getEmergencyAdminEmail(identifier);
  const cookieValue = createEmergencyAdminCookieValue(email);
  const [, expiresAtRaw] = cookieValue.split(".");
  const cookieStore = await cookies();

  cookieStore.set(
    "lux_admin_emergency",
    cookieValue,
    getEmergencyAdminCookieOptions(Number(expiresAtRaw)),
  );

  redirect(callbackUrl);
}
