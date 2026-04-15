"use client";

import { useEffect, useState } from "react";

type SecurityStatus = {
  email: string;
  role: string;
  twoFactorEnabled: boolean;
  recoveryCodesRemaining: number;
  resetEmailConfigured: boolean;
};

type SetupState = {
  secret: string;
  qrCodeDataUrl: string;
  otpauthUrl: string;
};

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
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [setup, setSetup] = useState<SetupState | null>(null);
  const [setupCode, setSetupCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function loadStatus() {
    const response = await fetch("/api/auth/security-status", {
      method: "GET",
      cache: "no-store",
    });
    const data = (await response.json()) as
      | { security?: SecurityStatus; error?: string }
      | null;

    if (!response.ok || !data?.security) {
      throw new Error(data?.error ?? "Could not load security settings.");
    }

    setStatus(data.security);
  }

  useEffect(() => {
    void loadStatus().catch((nextError) => {
      setError(nextError instanceof Error ? nextError.message : "Unknown error");
    });
  }, []);

  async function beginTwoFactorSetup() {
    try {
      setIsBusy(true);
      setError(null);
      setFeedback(null);
      setRecoveryCodes([]);

      const data = await postJson<{ setup: SetupState }>("/api/auth/2fa/setup");
      setSetup(data.setup);
      setFeedback("Scan the QR code, then confirm with a code from your authenticator app.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unknown error");
    } finally {
      setIsBusy(false);
    }
  }

  async function confirmTwoFactorSetup() {
    try {
      setIsBusy(true);
      setError(null);
      setFeedback(null);

      const data = await postJson<{ recoveryCodes: string[] }>("/api/auth/2fa/confirm", {
        code: setupCode,
      });

      setRecoveryCodes(data.recoveryCodes);
      setSetup(null);
      setSetupCode("");
      setFeedback("Two-factor authentication is now enabled.");
      await loadStatus();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unknown error");
    } finally {
      setIsBusy(false);
    }
  }

  async function disableTwoFactor() {
    try {
      setIsBusy(true);
      setError(null);
      setFeedback(null);

      await postJson("/api/auth/2fa/disable", {
        currentPassword: disablePassword,
        code: disableCode,
      });

      setDisablePassword("");
      setDisableCode("");
      setSetup(null);
      setRecoveryCodes([]);
      setFeedback("Two-factor authentication was disabled.");
      await loadStatus();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unknown error");
    } finally {
      setIsBusy(false);
    }
  }

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

  async function sendResetLink() {
    try {
      setIsBusy(true);
      setError(null);
      setFeedback(null);

      await postJson("/api/auth/request-password-reset", {
        email: userEmail,
      });
      setFeedback("If email is configured, a reset link has been sent.");
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
        Manage password access, reset links, and authenticator-app 2FA for the live admin account.
      </p>

      <div className="mt-5 grid gap-3">
        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] px-4 py-4 text-[14px] text-[#667085]">
          Signed in as <span className="font-semibold text-[#14162b]">{userEmail}</span>
        </div>
        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] px-4 py-4 text-[14px] text-[#667085]">
          Role <span className="font-semibold uppercase text-[#14162b]">{userRole}</span>
        </div>
        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] px-4 py-4 text-[14px] text-[#667085]">
          2FA status{" "}
          <span className="font-semibold text-[#14162b]">
            {status?.twoFactorEnabled ? "Enabled" : "Disabled"}
          </span>
          {status?.twoFactorEnabled ? (
            <span className="ml-2 text-[#98a2b3]">
              ({status.recoveryCodesRemaining} recovery codes left)
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {!status?.twoFactorEnabled ? (
          <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] p-4">
            <p className="text-[14px] font-semibold text-[#344054]">Two-Factor Authentication</p>
            {!setup ? (
              <button
                className="mt-4 inline-flex h-11 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isBusy}
                onClick={() => void beginTwoFactorSetup()}
                type="button"
              >
                Set Up Authenticator App
              </button>
            ) : (
              <div className="mt-4 grid gap-4">
                <div className="flex justify-center rounded-[10px] border border-[#d0d5dd] bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="2FA QR code" className="h-[220px] w-[220px]" src={setup.qrCodeDataUrl} />
                </div>
                <div className="rounded-[10px] border border-[#d0d5dd] bg-white px-4 py-4 text-[13px] leading-6 text-[#667085]">
                  Manual setup key: <span className="font-semibold text-[#14162b]">{setup.secret}</span>
                </div>
                <label className="grid gap-2">
                  <span className="text-[14px] font-semibold text-[#344054]">Confirm 6-digit code</span>
                  <input
                    className="h-11 rounded-[8px] border border-[#d0d5dd] bg-white px-3 text-[14px] font-medium text-[#344054] outline-none"
                    onChange={(event) => setSetupCode(event.target.value)}
                    type="text"
                    value={setupCode}
                    placeholder="123456"
                  />
                </label>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isBusy || setupCode.trim().length < 6}
                  onClick={() => void confirmTwoFactorSetup()}
                  type="button"
                >
                  Confirm And Enable 2FA
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] p-4">
            <p className="text-[14px] font-semibold text-[#344054]">Disable 2FA</p>
            <p className="mt-2 text-[14px] leading-6 text-[#667085]">
              Enter your current password and a current authenticator code or recovery code.
            </p>
            <div className="mt-4 grid gap-3">
              <input
                className="h-11 rounded-[8px] border border-[#d0d5dd] bg-white px-3 text-[14px] font-medium text-[#344054] outline-none"
                onChange={(event) => setDisablePassword(event.target.value)}
                type="password"
                value={disablePassword}
                placeholder="Current password"
              />
              <input
                className="h-11 rounded-[8px] border border-[#d0d5dd] bg-white px-3 text-[14px] font-medium text-[#344054] outline-none"
                onChange={(event) => setDisableCode(event.target.value)}
                type="text"
                value={disableCode}
                placeholder="Authenticator code or recovery code"
              />
              <button
                className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[#d0d5dd] bg-white px-4 text-[14px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isBusy || disablePassword.length < 8 || disableCode.trim().length < 6}
                onClick={() => void disableTwoFactor()}
                type="button"
              >
                Disable Two-Factor Authentication
              </button>
            </div>
          </div>
        )}

        {recoveryCodes.length > 0 ? (
          <div className="rounded-[10px] border border-[#eaecf0] bg-[#fffbea] p-4">
            <p className="text-[14px] font-semibold text-[#8a6b00]">Recovery Codes</p>
            <p className="mt-2 text-[14px] leading-6 text-[#7a6430]">
              Save these codes somewhere safe. Each code works once if your authenticator device is unavailable.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {recoveryCodes.map((code) => (
                <div
                  key={code}
                  className="rounded-[8px] border border-[#eadcb2] bg-white px-3 py-3 font-mono text-[14px] font-semibold text-[#5f4d1d]"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] p-4">
          <p className="text-[14px] font-semibold text-[#344054]">Change Password</p>
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

        <div className="rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] p-4">
          <p className="text-[14px] font-semibold text-[#344054]">Password Reset Link</p>
          <p className="mt-2 text-[14px] leading-6 text-[#667085]">
            {status?.resetEmailConfigured
              ? "Send a reset link to your admin email for emergency password recovery."
              : "Add SMTP credentials first if you want reset links sent by email."}
          </p>
          <button
            className="mt-4 inline-flex h-11 items-center justify-center rounded-[6px] border border-[#d0d5dd] bg-white px-4 text-[14px] font-semibold text-[#344054] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isBusy || !status?.resetEmailConfigured}
            onClick={() => void sendResetLink()}
            type="button"
          >
            Email Me A Reset Link
          </button>
        </div>
      </div>

      {feedback ? <p className="mt-4 text-sm font-semibold text-[#16a34a]">{feedback}</p> : null}
      {error ? <p className="mt-3 text-sm font-medium text-[#b42318]">{error}</p> : null}
    </div>
  );
}
