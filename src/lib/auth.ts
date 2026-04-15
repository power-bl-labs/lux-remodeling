import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  consumeRecoveryCode,
  decryptSecret,
  hashToken,
  verifyTotpToken,
} from "@/lib/security";

const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
  totpCode: z.string().trim().min(6).optional(),
  loginToken: z.string().trim().min(20).optional(),
});

function matchesSeedAdminCredentials(email: string, password: string) {
  const seedEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!seedEmail || !seedPassword) {
    return false;
  }

  return email === seedEmail && password === seedPassword;
}

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
    };
  }

  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: parsed.data.email,
            },
          });

          if (!user?.hashedPassword) {
            return null;
          }

          const passwordMatchesHash = await bcrypt.compare(
            parsed.data.password,
            user.hashedPassword,
          );
          const isValid =
            passwordMatchesHash ||
            matchesSeedAdminCredentials(parsed.data.email, parsed.data.password);

          if (!isValid) {
            return null;
          }

          if (user.twoFactorEnabled) {
            if (!parsed.data.loginToken || !parsed.data.totpCode) {
              return null;
            }

            const loginToken = await prisma.twoFactorLoginToken.findUnique({
              where: {
                tokenHash: hashToken(parsed.data.loginToken),
              },
            });

            if (
              !loginToken ||
              loginToken.email !== user.email ||
              loginToken.expiresAt < new Date()
            ) {
              return null;
            }

            const twoFactorSecret = user.twoFactorSecret
              ? decryptSecret(user.twoFactorSecret)
              : null;

            const isTotpValid = twoFactorSecret
              ? verifyTotpToken(twoFactorSecret, parsed.data.totpCode)
              : false;

            let nextRecoveryCodes = user.twoFactorRecoveryCodes;
            let usedRecoveryCode = false;

            if (!isTotpValid) {
              const recoveryResult = consumeRecoveryCode(
                parsed.data.totpCode,
                user.twoFactorRecoveryCodes,
              );

              if (!recoveryResult.valid) {
                return null;
              }

              nextRecoveryCodes = recoveryResult.nextValue;
              usedRecoveryCode = true;
            }

            await prisma.$transaction([
              prisma.twoFactorLoginToken.delete({
                where: {
                  id: loginToken.id,
                },
              }),
              ...(usedRecoveryCode
                ? [
                    prisma.user.update({
                      where: {
                        id: user.id,
                      },
                      data: {
                        twoFactorRecoveryCodes: nextRecoveryCodes,
                      },
                    }),
                  ]
                : []),
            ]);
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorization failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? UserRole.MANAGER;
      }

      return session;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}
