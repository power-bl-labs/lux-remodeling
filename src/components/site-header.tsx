"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDemoLogo } from "@/lib/demo-store";

const navItems = [
  {
    label: "Remodeling",
    description: "San Jose kitchen, bath, and whole-home remodeling shaped around scope, finishes, and family flow.",
    image: "/service-kitchen-bright.jpg",
    imagePosition: "center 58%",
    items: [
      "Kitchen Remodeling",
      "Bathroom Remodeling",
      "Whole Home Remodeling",
      "Home Additions",
    ],
  },
  {
    label: "Design",
    description: "Early-stage planning for additions, ADUs, reconfigurations, and permit-ready decisions.",
    image: "/service-design-plans.jpg",
    imagePosition: "center center",
    items: [
      "Space Planning",
      "ADU Planning",
      "Material Selections",
      "Permit Drawings",
    ],
  },
  {
    label: "Build",
    description: "From approved plans into managed execution, inspections, and polished final delivery.",
    image: "/service-addition-frame.jpg",
    imagePosition: "center center",
    items: [
      "Project Management",
      "Construction Scheduling",
      "Trade Coordination",
      "Final Walkthrough",
    ],
  },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo.svg");

  useEffect(() => {
    function handleScroll() {
      setShowFloatingBar(window.scrollY > 120);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function syncLogo() {
      const nextLogo = await getDemoLogo();
      setLogoSrc(nextLogo ?? "/logo.svg");
    }

    void syncLogo();
    window.addEventListener("storage", syncLogo);
    window.addEventListener("lux-demo-logo-updated", syncLogo);

    return () => {
      window.removeEventListener("storage", syncLogo);
      window.removeEventListener("lux-demo-logo-updated", syncLogo);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-[#dfe3ea] bg-[rgba(255,255,255,0.96)] backdrop-blur transition-transform duration-300 ease-out ${
          showFloatingBar ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[1480px] items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open Menu"
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#dfe3ea] bg-white text-[#101114] lg:hidden"
              onClick={() => setIsMenuOpen(true)}
              type="button"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="h-[2px] w-[18px] rounded-full bg-current" />
                <span className="h-[2px] w-[18px] rounded-full bg-current" />
                <span className="h-[2px] w-[18px] rounded-full bg-current" />
              </span>
            </button>

            <Link
              className="flex items-center"
              href="/"
            >
              <div className="flex h-[39px] w-[180px] items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Luxmove"
                  className="block max-h-full max-w-full object-contain object-left"
                  src={logoSrc}
                />
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-3 lg:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                <button
                  className="relative inline-flex h-[56px] items-center rounded-[10px] px-4 text-[16px] font-bold tracking-[-0.02em] text-[var(--brand-dark)] transition hover:bg-[#f5f7fb] hover:text-[var(--brand-blue)]"
                  type="button"
                >
                  {item.label}
                  <span className="absolute bottom-[9px] left-4 right-4 h-[3px] origin-left scale-x-0 rounded-full bg-[var(--brand-blue)] transition duration-200 group-hover:scale-x-100" />
                </button>

                <div className="pointer-events-none absolute left-1/2 top-[calc(100%-2px)] z-30 w-[560px] -translate-x-1/2 translate-y-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-[12px] border border-[#e4e7ec] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
                    <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
                      <div className="overflow-hidden rounded-[10px] border border-[#dfe4ef] bg-[var(--brand-soft)]">
                        <div className="relative h-[208px]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={item.label}
                            className="absolute inset-0 h-full w-full object-cover"
                            src={item.image}
                            style={{ objectPosition: item.imagePosition }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(16,17,20,0.7)] via-[rgba(16,17,20,0.16)] to-transparent" />
                          <div className="absolute left-4 top-4 inline-flex items-center rounded-[6px] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-blue)] backdrop-blur-sm">
                            {item.label}
                          </div>
                        </div>

                        <div className="px-5 py-4">
                          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">
                            Featured Scope
                          </p>
                          <p className="mt-2 text-[16px] leading-7 text-[#586174]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <p className="px-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#7b859a]">
                          {item.label}
                        </p>
                        {item.items.map((subItem) => (
                          <a
                            key={subItem}
                            className="flex items-center justify-between rounded-[10px] px-3 py-3.5 text-[16px] font-semibold tracking-[-0.01em] text-[var(--brand-dark)] transition hover:bg-[#f7f9fc] hover:text-[var(--brand-blue)]"
                            href="#"
                          >
                            <span>{subItem}</span>
                            <span aria-hidden="true" className="text-[16px] leading-none text-[var(--brand-accent)]">
                              →
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              className="hidden h-12 items-center justify-center rounded-[6px] border border-[#dfe3ea] bg-white px-5 text-[15px] font-bold tracking-[-0.01em] text-[var(--brand-dark)] shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-blue)] hover:bg-[#f8faff] hover:shadow-[0_12px_24px_rgba(51,72,255,0.14)] sm:inline-flex lg:px-6"
              href="tel:+13525551234"
            >
              Call Us Now
            </a>
            <Link
              href="/instant-estimation"
              className="inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-bold tracking-[-0.01em] text-white shadow-[0_10px_24px_rgba(51,72,255,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--brand-blue)_88%,white)] hover:shadow-[0_16px_30px_rgba(51,72,255,0.34)] lg:px-6"
              style={{ color: "#ffffff" }}
            >
              Instant Estimation
            </Link>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-[rgba(10,22,50,0.42)] transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[86%] max-w-[360px] flex-col bg-white px-5 py-5 shadow-[0_25px_80px_rgba(12,24,54,0.22)] transition-transform duration-300 ease-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            className="flex items-center"
            href="/"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex h-[39px] w-[180px] items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Luxmove"
                className="block max-h-full max-w-full object-contain object-left"
                src={logoSrc}
              />
            </div>
          </Link>
          <button
            aria-label="Close Menu"
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#dfe3ea] text-[#101114]"
            onClick={() => setIsMenuOpen(false)}
            type="button"
          >
            ✕
          </button>
        </div>

        <nav className="mt-8 grid gap-5">
          {navItems.map((item) => (
            <div key={item.label} className="grid gap-3">
              <a
                className="text-[20px] font-bold text-[var(--brand-dark)]"
                href="#"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
              <div className="grid gap-2 border-l border-[#e4e7ec] pl-4">
                {item.items.map((subItem) => (
                  <a
                    key={subItem}
                    className="text-[14px] font-semibold text-[#667085]"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {subItem}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto grid gap-3 pb-2 pt-8">
          <a
            className="inline-flex h-12 items-center justify-center rounded-[6px] border border-[#dfe3ea] bg-white px-5 text-[15px] font-bold text-[var(--brand-dark)] transition hover:border-[var(--brand-blue)] hover:bg-[#f8faff]"
            href="tel:+13525551234"
          >
            Call Us Now
          </a>
          <Link
            href="/instant-estimation"
            className="inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(51,72,255,0.24)] transition hover:-translate-y-0.5 hover:opacity-95"
            style={{ color: "#ffffff" }}
          >
            Instant Estimation
          </Link>
          <Link
            className="pt-3 text-center text-[13px] font-semibold text-[#667084]"
            href="/admin-demo"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin Sign In
          </Link>
        </div>
      </aside>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 transition-all duration-300 ease-out ${
          showFloatingBar
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-[620px] gap-3 rounded-[12px] bg-[rgba(18,21,33,0.92)] p-3 shadow-[0_24px_60px_rgba(7,20,49,0.34)] backdrop-blur">
          <a
            className="inline-flex h-12 flex-1 items-center justify-center rounded-[6px] border border-white/14 bg-white/8 px-4 text-[14px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
            href="tel:+13525551234"
            style={{ color: "#ffffff" }}
          >
            Call Us Now
          </a>
          <Link
            href="/instant-estimation"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-4 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(51,72,255,0.24)] transition hover:-translate-y-0.5 hover:opacity-95"
            style={{ color: "#ffffff" }}
          >
            Instant Estimation
          </Link>
        </div>
      </div>
    </>
  );
}
