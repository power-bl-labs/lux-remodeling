import { NextResponse } from "next/server";
import {
  EMERGENCY_ADMIN_COOKIE_NAME,
  getEmergencyAdminCookieOptions,
} from "@/lib/emergency-admin";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    EMERGENCY_ADMIN_COOKIE_NAME,
    "",
    getEmergencyAdminCookieOptions(new Date(0)),
  );
  return response;
}
