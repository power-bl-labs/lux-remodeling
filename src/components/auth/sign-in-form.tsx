"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type SignInFormProps = {
  callbackUrl: string;
};

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const nextLogin = String(formData.get("login") ?? "").trim().toLowerCase();
    const nextPassword = String(formData.get("password") ?? "");

    setLogin(nextLogin);
    setPassword(nextPassword);

    const response = await fetch("/api/auth/emergency-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: nextLogin,
        password: nextPassword,
        callbackUrl,
      }),
    });

    const data = (await response.json().catch(() => null)) as
      | {
          ok?: boolean;
          redirectUrl?: string;
          error?: string;
        }
      | null;

    if (!response.ok || !data?.ok) {
      setError(data?.error ?? "Invalid credentials.");
      setIsPending(false);
      return;
    }

    window.location.assign(data.redirectUrl ?? callbackUrl);
  }

  return (
    <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="login">
          Login
        </label>
        <input
          required
          className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
          id="login"
          name="login"
          onChange={(event) => setLogin(event.target.value)}
          type="text"
          value={login}
          placeholder="admin"
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
          placeholder="admin13"
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
