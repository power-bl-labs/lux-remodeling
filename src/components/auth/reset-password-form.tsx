"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setFeedback(null);
    setError(null);

    const nextPassword = String(formData.get("password") ?? "");
    const nextConfirmPassword = String(formData.get("confirmPassword") ?? "");

    setPassword(nextPassword);
    setConfirmPassword(nextConfirmPassword);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password: nextPassword,
        confirmPassword: nextConfirmPassword,
      }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Could not reset the password.");
      setIsPending(false);
      return;
    }

    setFeedback("Password updated. Redirecting to sign-in...");
    setTimeout(() => {
      router.push("/sign-in");
      router.refresh();
    }, 900);
  }

  return (
    <form action={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="password">
          New Password
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
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          required
          className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
          id="confirmPassword"
          name="confirmPassword"
          onChange={(event) => setConfirmPassword(event.target.value)}
          type="password"
          value={confirmPassword}
          placeholder="Repeat your new password"
        />
      </div>

      <button
        className="inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Updating..." : "Update Password"}
      </button>

      {feedback ? <p className="text-sm font-semibold text-[#16a34a]">{feedback}</p> : null}
      {error ? <p className="text-sm font-medium text-[#b42318]">{error}</p> : null}
    </form>
  );
}
