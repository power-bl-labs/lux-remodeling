"use client";

import { startTransition, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type SignInFormProps = {
  callbackUrl: string;
};

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function finishSignIn({
    nextEmail,
    nextPassword,
    nextTwoFactorCode,
    nextLoginToken,
  }: {
    nextEmail: string;
    nextPassword: string;
    nextTwoFactorCode?: string;
    nextLoginToken?: string;
  }) {
    const result = await signIn("credentials", {
      email: nextEmail,
      password: nextPassword,
      totpCode: nextTwoFactorCode,
      loginToken: nextLoginToken,
      redirect: false,
      callbackUrl,
    });

    startTransition(() => {
      if (result?.error) {
        if (nextTwoFactorCode) {
          setError("The verification code is invalid or expired.");
          setIsPending(false);
          return;
        }

        void (async () => {
          const emergencyResponse = await fetch("/api/auth/emergency-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: nextEmail,
              password: nextPassword,
              callbackUrl,
            }),
          });

          const emergencyData = (await emergencyResponse.json().catch(() => null)) as
            | {
                ok?: boolean;
                redirectUrl?: string;
                error?: string;
              }
            | null;

          startTransition(() => {
            if (!emergencyResponse.ok || !emergencyData?.ok) {
              setError("Sign in failed. Check the seeded admin credentials and database connection.");
              setIsPending(false);
              return;
            }

            router.push(emergencyData.redirectUrl ?? callbackUrl);
            router.refresh();
          });
        })();
        return;
      }

      router.push(result?.url ?? callbackUrl);
      router.refresh();
    });
  }

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    if (requiresTwoFactor) {
      const code = String(formData.get("twoFactorCode") ?? "").trim();
      setTwoFactorCode(code);

      if (!loginToken) {
        setError("Your verification session expired. Start the sign-in flow again.");
        setRequiresTwoFactor(false);
        setIsPending(false);
        return;
      }

      await finishSignIn({
        nextEmail: email,
        nextPassword: password,
        nextTwoFactorCode: code,
        nextLoginToken: loginToken,
      });
      return;
    }

    const nextEmail = String(formData.get("email") ?? "").trim().toLowerCase();
    const nextPassword = String(formData.get("password") ?? "");

    setEmail(nextEmail);
    setPassword(nextPassword);

    const preflightResponse = await fetch("/api/auth/preflight-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: nextEmail,
        password: nextPassword,
      }),
    });

    const preflightData = (await preflightResponse.json().catch(() => null)) as
      | {
          requiresTwoFactor?: boolean;
          loginToken?: string;
          error?: string;
        }
      | null;

    if (!preflightResponse.ok) {
      setError(preflightData?.error ?? "Sign in failed.");
      setIsPending(false);
      return;
    }

    if (preflightData?.requiresTwoFactor && preflightData.loginToken) {
      setLoginToken(preflightData.loginToken);
      setRequiresTwoFactor(true);
      setTwoFactorCode("");
      setIsPending(false);
      return;
    }

    await finishSignIn({
      nextEmail,
      nextPassword,
    });
  }

  return (
    <form action={handleSubmit} className="mt-8 grid gap-4">
      {!requiresTwoFactor ? (
        <>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[#344054]" htmlFor="email">
              Email
            </label>
            <input
              required
              className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
              id="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
              placeholder="admin@luxremodeling.com"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[#344054]" htmlFor="password">
              Password
            </label>
            <input
              required
              className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
              id="password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
              placeholder="Minimum 8 characters"
            />
          </div>
        </>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-[10px] border border-[#e4e7ec] bg-[#f8fafc] px-4 py-4 text-[14px] leading-7 text-[#667085]">
            Second step is required for <span className="font-semibold text-[#14162b]">{email}</span>.
            Enter the 6-digit code from your authenticator app or one of your recovery codes.
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[#344054]" htmlFor="twoFactorCode">
              Verification Code
            </label>
            <input
              required
              className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
              id="twoFactorCode"
              name="twoFactorCode"
              onChange={(event) => setTwoFactorCode(event.target.value)}
              type="text"
              value={twoFactorCode}
              placeholder="123456 or recovery code"
            />
          </div>
        </div>
      )}

      <button
        className="mt-2 inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending
          ? "Signing In..."
          : requiresTwoFactor
            ? "Verify And Enter Admin"
            : "Sign In To Admin"}
      </button>

      {requiresTwoFactor ? (
        <button
          className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[#d0d5dd] bg-white px-5 text-[15px] font-semibold text-[#344054] transition hover:border-[#98a2b3]"
          disabled={isPending}
          onClick={() => {
            setRequiresTwoFactor(false);
            setLoginToken(null);
            setTwoFactorCode("");
            setError(null);
          }}
          type="button"
        >
          Back To Password
        </button>
      ) : null}

      {error ? <p className="text-sm font-medium text-[#b42318]">{error}</p> : null}
    </form>
  );
}
