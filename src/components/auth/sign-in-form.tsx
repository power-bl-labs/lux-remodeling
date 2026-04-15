"use client";

import { startTransition, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type SignInFormProps = {
  callbackUrl: string;
};

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    startTransition(() => {
      if (result?.error) {
        setError("Sign in failed. Check the seeded admin credentials and database connection.");
        setIsPending(false);
        return;
      }

      router.push(result?.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="mt-8 grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="email">
          Email
        </label>
        <input
          required
          className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
          id="email"
          name="email"
          type="email"
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
          type="password"
          placeholder="Minimum 8 characters"
        />
      </div>

      <button
        className="mt-2 inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing In..." : "Sign In To Admin"}
      </button>

      {error ? <p className="text-sm font-medium text-[#b42318]">{error}</p> : null}
    </form>
  );
}
