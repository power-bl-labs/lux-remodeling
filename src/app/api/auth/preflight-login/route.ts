import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createRandomToken,
  getTwoFactorLoginExpiry,
  hashToken,
} from "@/lib/security";

const schema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
});

function matchesSeedAdminCredentials(email: string, password: string) {
  const seedEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!seedEmail || !seedPassword) {
    return false;
  }

  return email === seedEmail && password === seedPassword;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });

    if (!user?.hashedPassword) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const passwordMatchesHash = await bcrypt.compare(
      parsed.data.password,
      user.hashedPassword,
    );
    const passwordIsValid =
      passwordMatchesHash ||
      matchesSeedAdminCredentials(parsed.data.email, parsed.data.password);

    if (!passwordIsValid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json({ ok: true, requiresTwoFactor: false });
    }

    const loginToken = createRandomToken(24);

    await prisma.$transaction([
      prisma.twoFactorLoginToken.deleteMany({
        where: {
          email: user.email,
        },
      }),
      prisma.twoFactorLoginToken.create({
        data: {
          email: user.email,
          tokenHash: hashToken(loginToken),
          expiresAt: getTwoFactorLoginExpiry(),
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      requiresTwoFactor: true,
      loginToken,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
