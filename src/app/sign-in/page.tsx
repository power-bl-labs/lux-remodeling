import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/admin-demo";

  return (
    <main className="min-h-screen bg-[#0c0f17] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[12px] border border-white/10 bg-[linear-gradient(180deg,rgba(51,72,255,0.18),rgba(13,16,24,0.92))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)] sm:p-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/58">
            Admin Demo
          </p>
          <h1 className="mt-4 max-w-[620px] text-[42px] leading-[0.95] font-semibold tracking-[-0.06em] text-white sm:text-[56px]">
            The Old Admin UI, Now Backed By Real Login And Live Data.
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-white/72">
            Sign in with the real manager account, then land in the familiar
            Vercel-like admin experience for leads, branding, and follow-up work.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "Protected Server Login",
              "Live Leads In MySQL",
              "Branding Saved Across Sessions",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[10px] border border-white/10 bg-white/6 px-5 py-5 text-[15px] font-medium text-white/86 backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[12px] border border-[#e4e7ec] bg-white p-8 text-[#14162b] shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-10">
          <div className="max-w-[520px]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
              Secure Sign In
            </p>
            <h2 className="mt-4 text-[32px] leading-[1] font-semibold tracking-[-0.05em]">
              Enter The Real Admin
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-[#667085]">
              This screen uses Auth.js credentials backed by the Prisma user table.
              After login, you will go straight into the old admin-demo interface.
            </p>

            <div className="mt-8">
              <SignInForm callbackUrl={callbackUrl} />
            </div>

            <div className="mt-4">
              <Link className="text-[14px] font-medium text-[#667085] underline-offset-4 hover:underline" href="/forgot-password">
                Forgot your password?
              </Link>
            </div>

            <div className="mt-8 rounded-[10px] border border-[#e4e7ec] bg-[#f8fafc] p-5 text-[14px] leading-7 text-[#667085]">
              <p>
                Route: <span className="font-semibold text-[#14162b]">/sign-in</span>
              </p>
              <p>
                Redirect: <span className="font-semibold text-[#14162b]">{callbackUrl}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link className="underline-offset-4 hover:underline" href="/">
                  Back to site
                </Link>
                <Link className="underline-offset-4 hover:underline" href="/admin-demo">
                  Open admin demo route
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
