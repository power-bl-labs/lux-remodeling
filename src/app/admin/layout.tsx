import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-[#f4efe8]">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
              Lux Remodeling Admin
            </p>
            <p className="mt-1 text-sm text-stone-700">
              Signed in as {session.user.email} ({session.user.role.toLowerCase()})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-500 hover:text-stone-950"
              href="/"
            >
              Public site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">{children}</div>
    </div>
  );
}
