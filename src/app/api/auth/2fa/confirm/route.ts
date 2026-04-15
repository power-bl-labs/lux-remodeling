import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createRecoveryCodes,
  decryptSecret,
  verifyTotpToken,
} from "@/lib/security";

const schema = z.object({
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
      return NextResponse.json({ ok: false, error: "Invalid 2FA code." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        twoFactorSecret: true,
      },
    });

    if (!user?.twoFactorSecret) {
      return NextResponse.json({ ok: false, error: "2FA setup is not ready." }, { status: 400 });
    }

    const secret = decryptSecret(user.twoFactorSecret);
    const isValid = verifyTotpToken(secret, parsed.data.code);

    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Invalid 2FA code." }, { status: 400 });
    }

    const recoveryCodes = createRecoveryCodes();

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        twoFactorEnabled: true,
        twoFactorRecoveryCodes: recoveryCodes.storedValue,
      },
    });

    return NextResponse.json({
      ok: true,
      recoveryCodes: recoveryCodes.plainCodes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
