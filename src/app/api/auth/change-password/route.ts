import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
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
      return NextResponse.json({ ok: false, error: "Invalid password payload." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user?.hashedPassword) {
      return NextResponse.json({ ok: false, error: "User password is not set." }, { status: 400 });
    }

    const passwordIsValid = await bcrypt.compare(
      parsed.data.currentPassword,
      user.hashedPassword,
    );

    if (!passwordIsValid) {
      return NextResponse.json({ ok: false, error: "Current password is incorrect." }, { status: 400 });
    }

    const nextHash = await bcrypt.hash(parsed.data.newPassword, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword: nextHash,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
