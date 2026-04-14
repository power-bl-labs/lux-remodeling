import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#efe3d7_0%,#f7f2ec_48%,#fbfaf8_100%)] px-6 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_30px_100px_rgba(42,28,20,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-stone-950 px-8 py-10 text-stone-100 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-400">
            Admin access
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white">
            Sign in for sales and lead operations.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-stone-300">
            This is the protected side of the project where managers will review
            new inquiries, track estimates, and move homeowners through the sales
            pipeline.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-stone-300">
            <p className="font-medium text-white">Before first real login:</p>
            <p>
              1. Set a real MySQL connection string in <code>.env</code>.
            </p>
            <p>2. Run Prisma push or migrations.</p>
            <p>3. Seed the first admin account.</p>
          </div>
        </section>

        <section className="px-8 py-10 md:px-10">
          <div className="max-w-md">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-stone-500">
              Credentials login
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-stone-950">
              Foundation is ready for your first manager account.
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              For now this screen is wired to Auth.js credentials backed by the
              Prisma user table.
            </p>

            <div className="mt-8">
              <SignInForm callbackUrl={callbackUrl} />
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-stone-50 p-5 text-sm text-stone-600">
              <p className="font-medium text-stone-950">Quick nav</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link className="underline-offset-4 hover:underline" href="/">
                  Back to site
                </Link>
                <Link className="underline-offset-4 hover:underline" href="/admin">
                  Try admin route
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
