import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createTotpQrDataUrl,
  encryptSecret,
  generateTotpSecret,
} from "@/lib/security";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { secret, otpauthUrl } = generateTotpSecret(session.user.email);
    const qrCodeDataUrl = await createTotpQrDataUrl(otpauthUrl);

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        twoFactorSecret: encryptSecret(secret),
        twoFactorEnabled: false,
      },
    });

    return NextResponse.json({
      ok: true,
      setup: {
        secret,
        otpauthUrl,
        qrCodeDataUrl,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
