import {
  defaultSiteBranding,
  type SiteBranding,
  type BrandThemeSettings,
} from "@/lib/brand-theme";

function isBrowser() {
  return typeof window !== "undefined";
}

function getLocalFallbackBranding(): SiteBranding {
  if (!isBrowser()) {
    return defaultSiteBranding;
  }

  try {
    const rawTheme = window.localStorage.getItem("lux-demo-theme");
    const rawLogo = window.localStorage.getItem("lux-demo-logo");
    const parsedTheme = rawTheme
      ? (JSON.parse(rawTheme) as Partial<BrandThemeSettings>)
      : {};

    return {
      brandBlue: parsedTheme.brandBlue ?? defaultSiteBranding.brandBlue,
      brandDark: parsedTheme.brandDark ?? defaultSiteBranding.brandDark,
      brandSoft: parsedTheme.brandSoft ?? defaultSiteBranding.brandSoft,
      brandAccent: parsedTheme.brandAccent ?? defaultSiteBranding.brandAccent,
      logoSrc: rawLogo ?? defaultSiteBranding.logoSrc,
    };
  } catch {
    return defaultSiteBranding;
  }
}

export async function fetchSiteBranding(): Promise<SiteBranding> {
  try {
    const response = await fetch("/api/site-branding", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Branding fetch failed");
    }

    const data = (await response.json()) as { branding?: SiteBranding };
    return data.branding ?? defaultSiteBranding;
  } catch {
    return getLocalFallbackBranding();
  }
}

export async function saveSiteBranding(input: Partial<SiteBranding>) {
  const response = await fetch("/api/site-branding", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Branding save failed");
  }

  const data = (await response.json()) as { branding?: SiteBranding };
  return data.branding ?? defaultSiteBranding;
}
