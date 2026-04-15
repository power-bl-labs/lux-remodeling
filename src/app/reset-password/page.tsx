import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";

  return (
    <main className="min-h-screen bg-[#0c0f17] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[12px] border border-white/10 bg-[linear-gradient(180deg,rgba(51,72,255,0.18),rgba(13,16,24,0.92))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.36)] sm:p-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/58">
            Reset Password
          </p>
          <h1 className="mt-4 max-w-[620px] text-[42px] leading-[0.95] font-semibold tracking-[-0.06em] text-white sm:text-[56px]">
            Choose A New Password For The Admin Account.
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-8 text-white/72">
            This link should only be used by the manager who requested the reset email.
          </p>
        </section>

        <section className="rounded-[12px] border border-[#e4e7ec] bg-white p-8 text-[#14162b] shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
            New Password
          </p>
          <h2 className="mt-4 text-[32px] leading-[1] font-semibold tracking-[-0.05em]">
            Set A Fresh Password
          </h2>
          {!token ? (
            <div className="mt-6 rounded-[10px] border border-[#f0d7d1] bg-[#fff7f5] p-5 text-[14px] leading-7 text-[#8a3a2c]">
              Reset token is missing or invalid. Open the link from your email again.
            </div>
          ) : (
            <div className="mt-8">
              <ResetPasswordForm token={token} />
            </div>
          )}

          <div className="mt-8 rounded-[10px] border border-[#e4e7ec] bg-[#f8fafc] p-5 text-[14px] leading-7 text-[#667085]">
            <Link className="underline-offset-4 hover:underline" href="/sign-in">
              Back to sign in
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
