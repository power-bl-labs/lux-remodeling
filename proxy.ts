import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { EMERGENCY_ADMIN_COOKIE_NAME, readEmergencyAdminCookieValue } from "@/lib/emergency-admin";

export async function proxy(request: NextRequest) {
  const isAdminPath =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/admin-demo");

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    return NextResponse.next();
  }

  const emergencyCookie = request.cookies.get(EMERGENCY_ADMIN_COOKIE_NAME)?.value;

  if (readEmergencyAdminCookieValue(emergencyCookie)) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/admin-demo/:path*"],
};
