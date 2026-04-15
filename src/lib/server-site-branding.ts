import { prisma } from "@/lib/prisma";
import { defaultSiteBranding, type SiteBranding } from "@/lib/brand-theme";
import { hasUsableDatabaseUrl } from "@/lib/database-config";

const SITE_SETTINGS_ID = "default";

export async function getStoredSiteBranding(): Promise<SiteBranding> {
  if (!hasUsableDatabaseUrl()) {
    return defaultSiteBranding;
  }

  const settings = await prisma.siteSettings.findUnique({
    where: {
      id: SITE_SETTINGS_ID,
    },
  });

  if (!settings) {
    return defaultSiteBranding;
  }

  return {
    brandBlue: settings.brandBlue,
    brandDark: settings.brandDark,
    brandSoft: settings.brandSoft,
    brandAccent: settings.brandAccent,
    logoSrc: settings.logoData,
  };
}

export async function saveStoredSiteBranding(
  input: Partial<SiteBranding>,
): Promise<SiteBranding> {
  if (!hasUsableDatabaseUrl()) {
    return {
      ...defaultSiteBranding,
      ...input,
    };
  }

  const current = await getStoredSiteBranding();
  const next = {
    ...current,
    ...input,
  };

  const settings = await prisma.siteSettings.upsert({
    where: {
      id: SITE_SETTINGS_ID,
    },
    update: {
      brandBlue: next.brandBlue,
      brandDark: next.brandDark,
      brandSoft: next.brandSoft,
      brandAccent: next.brandAccent,
      logoData: next.logoSrc,
    },
    create: {
      id: SITE_SETTINGS_ID,
      brandBlue: next.brandBlue,
      brandDark: next.brandDark,
      brandSoft: next.brandSoft,
      brandAccent: next.brandAccent,
      logoData: next.logoSrc,
    },
  });

  return {
    brandBlue: settings.brandBlue,
    brandDark: settings.brandDark,
    brandSoft: settings.brandSoft,
    brandAccent: settings.brandAccent,
    logoSrc: settings.logoData,
  };
}
