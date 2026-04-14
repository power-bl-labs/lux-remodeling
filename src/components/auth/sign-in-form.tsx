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
    <form action={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="email">
          Email
        </label>
        <input
          required
          className="rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-500"
          id="email"
          name="email"
          type="email"
          placeholder="manager@luxremodeling.com"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-stone-700" htmlFor="password">
          Password
        </label>
        <input
          required
          className="rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-stone-500"
          id="password"
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
        />
      </div>

      <button
        className="mt-2 rounded-full bg-stone-950 px-5 py-3 font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing in..." : "Sign in to admin"}
      </button>

      {error ? <p className="text-sm text-[#a6402d]">{error}</p> : null}
    </form>
  );
}
