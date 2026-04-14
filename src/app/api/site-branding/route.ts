import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getStoredSiteBranding,
  saveStoredSiteBranding,
} from "@/lib/server-site-branding";

const brandingSchema = z.object({
  brandBlue: z.string().min(4).max(64).optional(),
  brandDark: z.string().min(4).max(64).optional(),
  brandSoft: z.string().min(4).max(64).optional(),
  brandAccent: z.string().min(4).max(64).optional(),
  logoSrc: z.string().min(1).max(2_000_000).nullable().optional(),
});

export async function GET() {
  try {
    const branding = await getStoredSiteBranding();
    return NextResponse.json({ ok: true, branding });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message, branding: null },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = brandingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid branding payload" },
        { status: 400 },
      );
    }

    const branding = await saveStoredSiteBranding(parsed.data);
    return NextResponse.json({ ok: true, branding });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message, branding: null },
      { status: 500 },
    );
  }
}
