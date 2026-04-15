"use client";

import type { ChangeEvent } from "react";
import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { AdminSecurityPanel } from "@/components/admin/admin-security-panel";
import { DemoLead } from "@/lib/demo-store";
import {
  defaultBrandTheme,
  type BrandThemeSettings,
} from "@/lib/brand-theme";
import { fetchStoredLeads } from "@/lib/lead-notifications";
import {
  fetchSiteBranding,
  saveSiteBranding,
} from "@/lib/site-branding-client";
import { toDialableUsPhone } from "@/lib/us-phone";

type SidebarView = "branding" | "leads";
type LeadTab = "Quick Lead" | "Instant Estimation";
type AdminDemoShellProps = {
  userEmail: string;
  userRole: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminDemoShell({
  userEmail,
  userRole,
}: AdminDemoShellProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [view, setView] = useState<SidebarView>("leads");
  const [leadTab, setLeadTab] = useState<LeadTab>("Quick Lead");
  const [leads, setLeads] = useState<DemoLead[]>([]);
  const [theme, setTheme] = useState<BrandThemeSettings>(defaultBrandTheme);
  const [themeDraft, setThemeDraft] = useState<BrandThemeSettings>(defaultBrandTheme);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoDraft, setLogoDraft] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [themeSaved, setThemeSaved] = useState(false);
  const [logoSaved, setLogoSaved] = useState(false);

  const quickLeads = useMemo(
    () => leads.filter((lead) => lead.type === "Quick Lead"),
    [leads],
  );
  const estimationLeads = useMemo(
    () => leads.filter((lead) => lead.type === "Instant Estimation"),
    [leads],
  );

  useEffect(() => {
    async function syncLeads() {
      const nextLeads = await fetchStoredLeads();
      setLeads(nextLeads);
    }

    async function syncBranding() {
      const branding = await fetchSiteBranding();
      const nextTheme = {
        brandBlue: branding.brandBlue,
        brandDark: branding.brandDark,
        brandSoft: branding.brandSoft,
        brandAccent: branding.brandAccent,
      };

      setTheme(nextTheme);
      setThemeDraft(nextTheme);
      setLogo(branding.logoSrc);
      setLogoDraft(branding.logoSrc);
    }

    const frame = window.requestAnimationFrame(() => {
      setIsHydrated(true);
    });

    void syncLeads();
    void syncBranding();
    window.addEventListener("storage", syncLeads);
    window.addEventListener("lux-demo-leads-updated", syncLeads);
    window.addEventListener("lux-demo-theme-updated", syncBranding);
    window.addEventListener("lux-demo-logo-updated", syncBranding);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", syncLeads);
      window.removeEventListener("lux-demo-leads-updated", syncLeads);
      window.removeEventListener("lux-demo-theme-updated", syncBranding);
      window.removeEventListener("lux-demo-logo-updated", syncBranding);
    };
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-[#14162b] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px] rounded-[12px] border border-[#e4e7ec] bg-white px-6 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#98a2b3]">
            Loading Admin Demo
          </p>
          <div className="mt-4 h-10 w-[320px] rounded-[10px] bg-[#eef2f7]" />
          <div className="mt-4 h-24 rounded-[10px] bg-[#f8fafc]" />
        </div>
      </div>
    );
  }

  function updateThemeField<K extends keyof BrandThemeSettings>(
    key: K,
    value: BrandThemeSettings[K],
  ) {
    setThemeDraft({
      ...themeDraft,
      [key]: value,
    });
  }

  async function handleThemeSave() {
    const branding = await saveSiteBranding(themeDraft);
    const nextTheme = {
      brandBlue: branding.brandBlue,
      brandDark: branding.brandDark,
      brandSoft: branding.brandSoft,
      brandAccent: branding.brandAccent,
    };

    setTheme(nextTheme);
    setThemeDraft(nextTheme);
    window.dispatchEvent(new CustomEvent("lux-demo-theme-updated"));
    setThemeSaved(true);
    window.setTimeout(() => setThemeSaved(false), 1800);
  }

  async function handleLogoFileChange(event: ChangeEvent<HTMLInputElement>) {
    setLogoError(null);
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoDraft(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleLogoSave() {
    if (!logoDraft) {
      return;
    }

    try {
      const branding = await saveSiteBranding({
        logoSrc: logoDraft,
      });
      setLogo(branding.logoSrc);
      setLogoDraft(branding.logoSrc);
      setLogoError(null);
      window.dispatchEvent(new CustomEvent("lux-demo-logo-updated"));
      setLogoSaved(true);
      window.setTimeout(() => setLogoSaved(false), 1800);
    } catch {
      setLogoError("Could not save this logo file. Try a smaller SVG or image.");
    }
  }


  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#14162b]">
      <div className="grid min-h-screen lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-[#e4e7ec] bg-white px-5 py-6">
          <div className="flex min-h-[86px] items-center rounded-[10px] border border-[#eaecf0] bg-[#fbfcfe] px-4 py-4">
            {logoDraft ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Admin Logo" className="max-h-12 w-auto object-contain" src={logoDraft} />
            ) : (
              <div className="text-[18px] font-semibold tracking-[-0.04em] text-[var(--brand-dark)]">
                Lux Remodeling
              </div>
            )}
          </div>

          <nav className="mt-6 grid gap-2">
            <button
              className={`flex items-center justify-between rounded-[10px] px-4 py-3 text-left text-[15px] font-semibold transition ${
                view === "branding"
                  ? "bg-[var(--brand-blue)] text-white"
                  : "bg-[#f8fafc] text-[#344054] hover:bg-[#eef2f7]"
              }`}
              onClick={() => setView("branding")}
              style={view === "branding" ? { color: "#ffffff" } : undefined}
              type="button"
            >
              <span>Branding</span>
              <span aria-hidden="true">⌘</span>
            </button>

            <button
              className={`flex items-center justify-between rounded-[10px] px-4 py-3 text-left text-[15px] font-semibold transition ${
                view === "leads"
                  ? "bg-[var(--brand-blue)] text-white"
                  : "bg-[#f8fafc] text-[#344054] hover:bg-[#eef2f7]"
              }`}
              onClick={() => setView("leads")}
              style={view === "leads" ? { color: "#ffffff" } : undefined}
              type="button"
            >
              <span>Leads</span>
              <span className="rounded-full bg-white/16 px-2 py-0.5 text-[12px]">
                {leads.length}
              </span>
            </button>
          </nav>

          <button
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[6px] border border-[#d0d5dd] bg-white text-[15px] font-semibold text-[#344054] transition hover:border-[#98a2b3] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSigningOut}
            onClick={() => {
              setIsSigningOut(true);
              startTransition(async () => {
                await signOut({
                  callbackUrl: "/sign-in",
                });
              });
            }}
            type="button"
          >
            {isSigningOut ? "Signing Out..." : "Log Out"}
          </button>
          <Link
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[var(--brand-blue)] text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(51,72,255,0.18)] transition hover:-translate-y-0.5 hover:opacity-95"
            href="/"
            style={{ color: "#ffffff" }}
          >
            Back To Site
          </Link>
        </aside>

        <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="rounded-[12px] border border-[#e4e7ec] bg-white px-5 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:px-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#667085]">
                {view === "branding" ? "Theme Controls" : "Lead Inbox"}
              </p>
              <h2 className="mt-3 text-[34px] leading-[0.96] font-semibold tracking-[-0.05em] text-[var(--brand-dark)]">
                {view === "branding"
                  ? "Tune The Site Palette In Real Time."
                  : "Review Quick Leads As They Come In."}
              </h2>
            </div>
          </div>

          {view === "branding" ? (
            <section className="mt-6 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
              <div className="rounded-[12px] border border-[#e4e7ec] bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                <h3 className="text-[24px] leading-[1] font-semibold tracking-[-0.04em] text-[var(--brand-dark)]">
                  Brand Colors
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[#667085]">
                  Update the live theme for the marketing pages, then save the changes when the
                  palette feels right.
                </p>

                <div className="mt-6 grid gap-4">
                  {[
                    { label: "Brand Blue", key: "brandBlue" as const },
                    { label: "Brand Dark", key: "brandDark" as const },
                    { label: "Soft Surface", key: "brandSoft" as const },
                    { label: "Accent Highlight", key: "brandAccent" as const },
                  ].map((field) => (
                    <label
                      key={field.key}
                      className="grid gap-2 rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] p-4"
                    >
                      <span className="text-[14px] font-semibold text-[#344054]">{field.label}</span>
                      <div className="flex items-center gap-3">
                        <input
                          className="h-11 w-14 rounded-[8px] border border-[#d0d5dd] bg-transparent"
                          onChange={(event) => updateThemeField(field.key, event.target.value)}
                          type="color"
                          value={themeDraft[field.key]}
                        />
                        <input
                          className="h-11 flex-1 rounded-[8px] border border-[#d0d5dd] bg-white px-3 text-[14px] font-medium text-[#344054] outline-none"
                          onChange={(event) => updateThemeField(field.key, event.target.value)}
                          value={themeDraft[field.key]}
                        />
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  className="mt-5 inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(51,72,255,0.24)] transition hover:-translate-y-0.5 hover:opacity-95"
                  onClick={handleThemeSave}
                  style={{ color: "#ffffff" }}
                  type="button"
                >
                  Save Changes
                </button>
                {themeSaved ? (
                  <p className="mt-3 text-sm font-semibold text-[#16a34a]">Saved</p>
                ) : null}
              </div>

              <div className="rounded-[12px] border border-[#e4e7ec] bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                <h3 className="text-[24px] leading-[1] font-semibold tracking-[-0.04em] text-[var(--brand-dark)]">
                  Logo
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[#667085]">
                  Upload a replacement logo for the live header preview and save it when ready.
                </p>

                <div className="mt-6 rounded-[10px] border border-[#eaecf0] bg-[#f8fafc] p-5">
                  <div className="flex min-h-[96px] items-center justify-center rounded-[10px] border border-dashed border-[#d0d5dd] bg-white px-4 py-6">
                    {logoDraft ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="Logo Preview" className="max-h-14 w-auto object-contain" src={logoDraft} />
                    ) : (
                      <span className="text-[14px] font-medium text-[#667085]">No custom logo uploaded yet</span>
                    )}
                  </div>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-[14px] font-semibold text-[#344054]">Upload Logo File</span>
                    <input
                      accept=".svg,image/*"
                      className="block w-full rounded-[8px] border border-[#d0d5dd] bg-white px-3 py-3 text-[14px] font-medium text-[#344054]"
                      onChange={handleLogoFileChange}
                      type="file"
                    />
                  </label>
                </div>

                <button
                  className="mt-5 inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(51,72,255,0.24)] transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55"
                  disabled={!logoDraft || logoDraft === logo}
                  onClick={handleLogoSave}
                  style={{ color: "#ffffff" }}
                  type="button"
                >
                  Save Changes
                </button>
                {logoSaved ? (
                  <p className="mt-3 text-sm font-semibold text-[#16a34a]">Saved</p>
                ) : null}
                {logoError ? (
                  <p className="mt-3 text-sm font-medium text-[#b42318]">{logoError}</p>
                ) : null}
              </div>

              <AdminSecurityPanel userEmail={userEmail} userRole={userRole} />

              <div className="rounded-[12px] border border-[#e4e7ec] bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                <h3 className="text-[24px] leading-[1] font-semibold tracking-[-0.04em] text-[var(--brand-dark)]">
                  Quick Preview
                </h3>
                <div
                  className="mt-6 overflow-hidden rounded-[10px] border border-[#dfe3ea]"
                  style={{ backgroundColor: theme.brandSoft }}
                >
                  <div className="border-b border-[#dfe3ea] bg-white px-5 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {logoDraft ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt="Preview Logo" className="h-auto max-w-[132px]" src={logoDraft} />
                        ) : (
                          <div className="text-[15px] font-semibold" style={{ color: theme.brandDark }}>
                            Lux Remodeling
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <div className="rounded-[6px] border px-4 py-2 text-[13px] font-semibold" style={{ borderColor: "#d0d5dd", color: theme.brandDark }}>
                          Call Us Now
                        </div>
                        <div className="rounded-[6px] px-4 py-2 text-[13px] font-semibold text-white" style={{ backgroundColor: theme.brandBlue, color: "#ffffff" }}>
                          Instant Estimation
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-8">
                    <div className="rounded-[10px] p-6 text-white" style={{ backgroundColor: theme.brandDark }}>
                      <p className="text-sm text-white/72">Live Site Theme</p>
                      <div
                        className="mt-4 inline-flex rounded-[6px] bg-white/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: theme.brandAccent }}
                      >
                        Accent Highlight
                      </div>
                      <p className="mt-3 max-w-[520px] text-[28px] leading-[1.02] font-semibold tracking-[-0.04em]">
                        Premium blue highlights, soft light surfaces, and a dark editorial base.
                      </p>
                      <div className="mt-5 inline-flex rounded-[6px] px-4 py-2 text-[14px] font-semibold text-white" style={{ backgroundColor: theme.brandBlue, color: "#ffffff" }}>
                        Preview CTA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="mt-6">
              <div className="flex flex-wrap gap-3">
                {(["Quick Lead", "Instant Estimation"] as LeadTab[]).map((tab) => (
                  <button
                    key={tab}
                    className={`rounded-[6px] px-4 py-2.5 text-[14px] font-semibold transition ${
                      leadTab === tab
                        ? "bg-[var(--brand-blue)] text-white"
                        : "bg-white text-[#475467] ring-1 ring-[#d0d5dd] hover:bg-[#f8fafc]"
                    }`}
                    onClick={() => setLeadTab(tab)}
                    style={leadTab === tab ? { color: "#ffffff" } : undefined}
                    type="button"
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {leadTab === "Quick Lead" ? (
                <div className="mt-5 grid gap-4">
                  {quickLeads.length === 0 ? (
                    <div className="rounded-[12px] border border-dashed border-[#d0d5dd] bg-white px-6 py-12 text-center text-[#667085]">
                      No quick leads yet. Submit the hero form on the homepage and the lead will
                      appear here instantly.
                    </div>
                  ) : (
                    quickLeads.map((lead) => (
                      <article
                        key={lead.id}
                        className="grid gap-4 rounded-[12px] border border-[#e4e7ec] bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] lg:grid-cols-[minmax(0,1fr)_auto]"
                      >
                        <div className="grid gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-[6px] bg-[var(--brand-soft)] px-3 py-1 text-[12px] font-semibold text-[var(--brand-dark)]">
                              {lead.type}
                            </span>
                            <span className="rounded-[6px] bg-[#eef4ff] px-3 py-1 text-[12px] font-semibold text-[var(--brand-blue)]">
                              {lead.mode}
                            </span>
                            <span className="text-[13px] font-medium text-[#667085]">
                              {formatDate(lead.createdAt)}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-[26px] leading-[1] font-semibold tracking-[-0.04em] text-[var(--brand-dark)]">
                              {lead.service}
                            </h3>
                            <p className="mt-2 text-[16px] font-medium text-[#475467]">{lead.phone}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                          <a
                            className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[14px] font-semibold text-white"
                            href={`tel:${toDialableUsPhone(lead.phone)}`}
                            style={{ color: "#ffffff" }}
                          >
                            Call Lead
                          </a>
                          <a
                            className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[#d0d5dd] bg-white px-5 text-[14px] font-semibold text-[#344054]"
                            href={`sms:${toDialableUsPhone(lead.phone)}`}
                          >
                            Send SMS
                          </a>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {estimationLeads.length === 0 ? (
                    <div className="rounded-[12px] border border-dashed border-[#d0d5dd] bg-white px-6 py-12 text-center text-[#667085]">
                      No instant estimation requests yet. Open the instant estimation page, submit
                      a request, and it will appear here with all project details.
                    </div>
                  ) : (
                    estimationLeads.map((lead) => (
                      <article
                        key={lead.id}
                        className="grid gap-4 rounded-[12px] border border-[#e4e7ec] bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-[6px] bg-[var(--brand-soft)] px-3 py-1 text-[12px] font-semibold text-[var(--brand-dark)]">
                            {lead.type}
                          </span>
                          <span className="rounded-[6px] bg-[#eef4ff] px-3 py-1 text-[12px] font-semibold text-[var(--brand-blue)]">
                            {lead.propertyType ?? "Project"}
                          </span>
                          <span className="rounded-[6px] bg-[#fff6d8] px-3 py-1 text-[12px] font-semibold text-[#8a6b00]">
                            Starting From {lead.estimate ? `$${lead.estimate.toLocaleString()}` : "N/A"}
                          </span>
                          <span className="text-[13px] font-medium text-[#667085]">
                            {formatDate(lead.createdAt)}
                          </span>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto]">
                          <div className="grid gap-4">
                            <div>
                              <h3 className="text-[26px] leading-[1] font-semibold tracking-[-0.04em] text-[var(--brand-dark)]">
                                {lead.name ?? "Unnamed Prospect"}
                              </h3>
                              <p className="mt-2 text-[16px] font-medium text-[#475467]">
                                {lead.phone}
                              </p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                              <div className="rounded-[10px] bg-[#f8fafc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                                  Service
                                </p>
                                <p className="mt-2 text-[15px] font-semibold text-[var(--brand-dark)]">
                                  {lead.service}
                                </p>
                              </div>
                              <div className="rounded-[10px] bg-[#f8fafc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                                  Timeline
                                </p>
                                <p className="mt-2 text-[15px] font-semibold text-[var(--brand-dark)]">
                                  {lead.timeline ?? "Not Provided"}
                                </p>
                              </div>
                              <div className="rounded-[10px] bg-[#f8fafc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                                  ZIP Code
                                </p>
                                <p className="mt-2 text-[15px] font-semibold text-[var(--brand-dark)]">
                                  {lead.zipCode ?? "Not Provided"}
                                </p>
                              </div>
                              <div className="rounded-[10px] bg-[#f8fafc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                                  Square Footage
                                </p>
                                <p className="mt-2 text-[15px] font-semibold text-[var(--brand-dark)]">
                                  {lead.squareFootage ? `${lead.squareFootage} sq ft` : "Not Provided"}
                                </p>
                              </div>
                              <div className="rounded-[10px] bg-[#f8fafc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                                  Property
                                </p>
                                <p className="mt-2 text-[15px] font-semibold text-[var(--brand-dark)]">
                                  {lead.propertyType ?? "Not Provided"}
                                </p>
                              </div>
                              <div className="rounded-[10px] bg-[#f8fafc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                                  Estimate
                                </p>
                                <p className="mt-2 text-[15px] font-semibold text-[var(--brand-dark)]">
                                  {lead.estimate ? `$${lead.estimate.toLocaleString()}` : "Not Provided"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                            <a
                            className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[14px] font-semibold text-white"
                              href={`tel:${toDialableUsPhone(lead.phone)}`}
                              style={{ color: "#ffffff" }}
                            >
                              Call Lead
                            </a>
                            <a
                            className="inline-flex h-11 items-center justify-center rounded-[6px] border border-[#d0d5dd] bg-white px-5 text-[14px] font-semibold text-[#344054]"
                              href={`sms:${toDialableUsPhone(lead.phone)}`}
                            >
                              Send SMS
                            </a>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
