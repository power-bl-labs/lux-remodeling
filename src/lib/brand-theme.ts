export type BrandThemeSettings = {
  brandBlue: string;
  brandDark: string;
  brandSoft: string;
  brandAccent: string;
};

export type SiteBranding = BrandThemeSettings & {
  logoSrc: string | null;
};

export const defaultBrandTheme: BrandThemeSettings = {
  brandBlue: "#3348ff",
  brandDark: "#14162b",
  brandSoft: "#edf2f8",
  brandAccent: "#f0c62e",
};

export const defaultSiteBranding: SiteBranding = {
  ...defaultBrandTheme,
  logoSrc: null,
};
