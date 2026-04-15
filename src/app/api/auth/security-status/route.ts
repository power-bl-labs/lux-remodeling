import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isMailConfigured } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { countRecoveryCodes } from "@/lib/security";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        email: true,
        role: true,
        twoFactorEnabled: true,
        twoFactorRecoveryCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      security: {
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        recoveryCodesRemaining: countRecoveryCodes(user.twoFactorRecoveryCodes),
        resetEmailConfigured: isMailConfigured(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
