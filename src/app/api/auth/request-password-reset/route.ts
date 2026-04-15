import { NextResponse } from "next/server";
import { z } from "zod";
import { isMailConfigured, sendPasswordResetEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import {
  buildPasswordResetUrl,
  createRandomToken,
  getPasswordResetExpiry,
  hashToken,
} from "@/lib/security";

const schema = z.object({
  email: z.email().trim().toLowerCase(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user || !isMailConfigured()) {
      return NextResponse.json({ ok: true });
    }

    const token = createRandomToken(32);

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(token),
          expiresAt: getPasswordResetExpiry(),
        },
      }),
    ]);

    await sendPasswordResetEmail({
      to: user.email,
      resetUrl: buildPasswordResetUrl(token),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
