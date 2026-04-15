import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { matchesSeedAdminCredentials } from "@/lib/emergency-admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
});

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

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    const isSeedAdminLogin = matchesSeedAdminCredentials(
      parsed.data.email,
      parsed.data.password,
    );
    let passwordIsValid = isSeedAdminLogin;

    if (!passwordIsValid) {
      if (!user.hashedPassword) {
        return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
      }

      passwordIsValid = await bcrypt.compare(
        parsed.data.password,
        user.hashedPassword,
      );
    }

    if (!passwordIsValid) {
      return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      requiresTwoFactor: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
