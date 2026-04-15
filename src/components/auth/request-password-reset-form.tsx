"use client";

import { useState } from "react";

export function RequestPasswordResetForm() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setFeedback(null);
    setError(null);

    const nextEmail = String(formData.get("email") ?? "").trim().toLowerCase();
    setEmail(nextEmail);

    const response = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: nextEmail,
      }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setError(data?.error ?? "Could not request a reset link.");
      setIsPending(false);
      return;
    }

    setFeedback("If that email exists and SMTP is configured, a reset link has been sent.");
    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="email">
          Admin Email
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

      <button
        className="inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Sending..." : "Send Reset Link"}
      </button>

      {feedback ? <p className="text-sm font-semibold text-[#16a34a]">{feedback}</p> : null}
      {error ? <p className="text-sm font-medium text-[#b42318]">{error}</p> : null}
    </form>
  );
}
