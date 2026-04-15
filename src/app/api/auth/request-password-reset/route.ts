import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Password reset is disabled in this build." },
    { status: 410 },
  );
}
