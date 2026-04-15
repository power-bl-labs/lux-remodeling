import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getEmergencyAdminSession,
  matchesSeedAdminCredentials,
} from "@/lib/emergency-admin";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
});

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

          if (!user) {
            return null;
          }

          const isSeedAdminLogin = matchesSeedAdminCredentials(
            parsed.data.email,
            parsed.data.password,
          );

          let isValid = isSeedAdminLogin;

          if (!isValid) {
            if (!user.hashedPassword) {
              return null;
            }

            isValid = await bcrypt.compare(
              parsed.data.password,
              user.hashedPassword,
            );
          }

          if (!isValid) {
            return null;
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
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return session;
  }

  return getEmergencyAdminSession();
}

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}
