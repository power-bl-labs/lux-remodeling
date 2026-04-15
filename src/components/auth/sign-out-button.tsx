"use client";

import { startTransition, useState } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-500 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={() => {
        setIsPending(true);
        startTransition(async () => {
          await fetch("/api/auth/emergency-logout", {
            method: "POST",
          }).catch(() => null);

          await signOut({
            callbackUrl: "/",
          });
        });
      }}
      type="button"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
