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
  if (!isBrowser()) {
    return defaultSiteBranding;
  }

  try {
    const storedTheme = window.localStorage.getItem(LEGACY_THEME_KEY);
    const storedLogo = window.localStorage.getItem(LEGACY_LOGO_KEY);
    const parsedTheme = storedTheme
      ? (JSON.parse(storedTheme) as Partial<BrandThemeSettings>)
      : null;

    return {
      brandBlue: parsedTheme?.brandBlue ?? defaultSiteBranding.brandBlue,
      brandDark: parsedTheme?.brandDark ?? defaultSiteBranding.brandDark,
      brandSoft: parsedTheme?.brandSoft ?? defaultSiteBranding.brandSoft,
      brandAccent: parsedTheme?.brandAccent ?? defaultSiteBranding.brandAccent,
      logoSrc: storedLogo ?? defaultSiteBranding.logoSrc,
    };
  } catch {
    return defaultSiteBranding;
  }
}

function isDefaultBranding(branding: SiteBranding) {
  return (
    branding.brandBlue === defaultSiteBranding.brandBlue &&
    branding.brandDark === defaultSiteBranding.brandDark &&
    branding.brandSoft === defaultSiteBranding.brandSoft &&
    branding.brandAccent === defaultSiteBranding.brandAccent &&
    branding.logoSrc === defaultSiteBranding.logoSrc
  );
}

function canUseBrowserFallback() {
  return (
    isBrowser() &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  );
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
  const localFallbackBranding = getLocalFallbackBranding();

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

    if (
      canUseBrowserFallback() &&
      !isDefaultBranding(localFallbackBranding) &&
      isDefaultBranding(branding)
    ) {
      return localFallbackBranding;
    }

    syncLegacyBrandingCache(branding);
    return branding;
  } catch {
    return localFallbackBranding;
  }
}

export async function saveSiteBranding(input: Partial<SiteBranding>) {
  try {
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
  } catch (error) {
    if (!canUseBrowserFallback()) {
      throw error;
    }

    const branding = {
      ...getLocalFallbackBranding(),
      ...input,
    };

    syncLegacyBrandingCache(branding);
    return branding;
  }
}
