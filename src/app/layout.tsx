import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { defaultSiteBranding } from "@/lib/brand-theme";
import { DemoThemeSync } from "@/components/demo-theme-sync";
import { getStoredSiteBranding } from "@/lib/server-site-branding";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lux Remodeling",
  description:
    "Marketing site and lead management workspace for a home remodeling business.",
};

async function getInitialThemeStyle(): Promise<CSSProperties> {
  try {
    const branding = await getStoredSiteBranding();

    return {
      "--brand-blue": branding.brandBlue,
      "--brand-dark": branding.brandDark,
      "--brand-soft": branding.brandSoft,
      "--brand-accent": branding.brandAccent,
    } as CSSProperties;
  } catch (error) {
    console.error("Falling back to default theme during initial render:", error);

    return {
      "--brand-blue": defaultSiteBranding.brandBlue,
      "--brand-dark": defaultSiteBranding.brandDark,
      "--brand-soft": defaultSiteBranding.brandSoft,
      "--brand-accent": defaultSiteBranding.brandAccent,
    } as CSSProperties;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  const themeStyle = await getInitialThemeStyle();

  return (
    <html lang="en" className="h-full antialiased" style={themeStyle}>
      <body className="min-h-full bg-background text-foreground">
        <DemoThemeSync />
        {children}
      </body>
    </html>
  );
}
