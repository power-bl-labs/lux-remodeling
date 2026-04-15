"use client";

import { useState } from "react";

type AdminSecurityPanelProps = {
  userEmail: string;
  userRole: string;
};

async function postJson<T>(url: string, body?: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json().catch(() => null)) as T | null;

  if (!response.ok) {
    const errorMessage =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "Request failed.";
    throw new Error(errorMessage);
  }

  if (!data) {
    throw new Error("Request returned an empty response.");
  }

  return data;
}

export function AdminSecurityPanel({
  userEmail,
  userRole,
}: AdminSecurityPanelProps) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function changePassword() {
    try {
      setIsBusy(true);
      setError(null);
      setFeedback(null);

      await postJson("/api/auth/change-password", passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFeedback("Password updated successfully.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unknown error");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="rounded-[12px] border border-[#e4e7ec] bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
      <h3 className="text-[24px] leading-[1] font-semibold tracking-[-0.04em] text-[var(--brand-dark)]">
        Security
      </h3>
      <p className="mt-3 text-[15px] leading-7 text-[#667085]">
        Manage simple email and password access for the admin account.
      </p>

      <div className="mt-5 grid gap-3">
        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] px-4 py-4 text-[14px] text-[#667085]">
          Signed in as <span className="font-semibold text-[#14162b]">{userEmail}</span>
        </div>
        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] px-4 py-4 text-[14px] text-[#667085]">
          Role <span className="font-semibold uppercase text-[#14162b]">{userRole}</span>
        </div>
        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] px-4 py-4 text-[14px] text-[#667085]">
          Login mode <span className="font-semibold text-[#14162b]">Email and password</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] p-4">
          <p className="text-[14px] font-semibold text-[#344054]">Change Password</p>
          <p className="mt-2 text-[14px] leading-6 text-[#667085]">
            Password reset by email is disabled in this build. Use this form after signing in, or update
            `SEED_ADMIN_PASSWORD` in Hostinger and redeploy if you need to replace the admin password directly.
          </p>
          <div className="mt-4 grid gap-3">
            <input
              className="h-11 rounded-[8px] border border-[#d0d5dd] bg-white px-3 text-[14px] font-medium text-[#344054] outline-none"
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
              type="password"
              value={passwordForm.currentPassword}
              placeholder="Current password"
            />
            <input
              className="h-11 rounded-[8px] border border-[#d0d5dd] bg-white px-3 text-[14px] font-medium text-[#344054] outline-none"
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              type="password"
              value={passwordForm.newPassword}
              placeholder="New password"
            />
            <input
              className="h-11 rounded-[8px] border border-[#d0d5dd] bg-white px-3 text-[14px] font-medium text-[#344054] outline-none"
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  confirmPassword: event.target.value,
                }))
              }
              type="password"
              value={passwordForm.confirmPassword}
              placeholder="Confirm new password"
            />
            <button
              className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                isBusy ||
                passwordForm.currentPassword.length < 8 ||
                passwordForm.newPassword.length < 8 ||
                passwordForm.confirmPassword.length < 8
              }
              onClick={() => void changePassword()}
              type="button"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {feedback ? <p className="mt-4 text-sm font-semibold text-[#16a34a]">{feedback}</p> : null}
      {error ? <p className="mt-3 text-sm font-medium text-[#b42318]">{error}</p> : null}
    </div>
  );
}
