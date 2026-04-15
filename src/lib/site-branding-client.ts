import {
  defaultSiteBranding,
  type SiteBranding,
  type BrandThemeSettings,
} from "@/lib/brand-theme";

const LEGACY_THEME_KEY = "lux-demo-theme";
const LEGACY_LOGO_KEY = "lux-demo-logo";

function isBrowser() {
  return typeof window !== "undefined";
}

function getLocalFallbackBranding(): SiteBranding {
  return defaultSiteBranding;
}

function syncLegacyBrandingCache(branding: SiteBranding) {
  if (!isBrowser()) {
    return;
  }

  try {
    const theme: BrandThemeSettings = {
      brandBlue: branding.brandBlue,
      brandDark: branding.brandDark,
      brandSoft: branding.brandSoft,
      brandAccent: branding.brandAccent,
    };

    window.localStorage.setItem(LEGACY_THEME_KEY, JSON.stringify(theme));

    if (branding.logoSrc) {
      window.localStorage.setItem(LEGACY_LOGO_KEY, branding.logoSrc);
    } else {
      window.localStorage.removeItem(LEGACY_LOGO_KEY);
    }
  } catch {
    // Ignore cache sync failures. The live API response is the source of truth.
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
    const branding = data.branding ?? defaultSiteBranding;
    syncLegacyBrandingCache(branding);
    return branding;
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
  const branding = data.branding ?? defaultSiteBranding;
  syncLegacyBrandingCache(branding);
  return branding;
}
