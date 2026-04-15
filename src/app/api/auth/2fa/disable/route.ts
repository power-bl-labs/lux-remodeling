import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  consumeRecoveryCode,
  decryptSecret,
  verifyTotpToken,
} from "@/lib/security";

const schema = z.object({
  currentPassword: z.string().min(8),
  code: z.string().trim().min(6),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid disable payload." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user?.hashedPassword || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ ok: false, error: "2FA is not enabled." }, { status: 400 });
    }

    const passwordIsValid = await bcrypt.compare(
      parsed.data.currentPassword,
      user.hashedPassword,
    );

    if (!passwordIsValid) {
      return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 400 });
    }

    const secret = decryptSecret(user.twoFactorSecret);
    const totpIsValid = verifyTotpToken(secret, parsed.data.code);

    if (!totpIsValid) {
      const recoveryResult = consumeRecoveryCode(parsed.data.code, user.twoFactorRecoveryCodes);

      if (!recoveryResult.valid) {
        return NextResponse.json({ ok: false, error: "Invalid 2FA code." }, { status: 400 });
      }
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorRecoveryCodes: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
