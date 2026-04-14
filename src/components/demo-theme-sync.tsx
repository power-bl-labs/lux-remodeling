"use client";

import { useEffect } from "react";
import { applyThemeToDocument } from "@/lib/demo-store";
import { fetchSiteBranding } from "@/lib/site-branding-client";

export function DemoThemeSync() {
  useEffect(() => {
    async function syncTheme() {
      const branding = await fetchSiteBranding();
      applyThemeToDocument({
        brandBlue: branding.brandBlue,
        brandDark: branding.brandDark,
        brandSoft: branding.brandSoft,
        brandAccent: branding.brandAccent,
      });
    }

    void syncTheme();

    window.addEventListener("storage", syncTheme);
    window.addEventListener("lux-demo-theme-updated", syncTheme);
    window.addEventListener("lux-demo-logo-updated", syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("lux-demo-theme-updated", syncTheme);
      window.removeEventListener("lux-demo-logo-updated", syncTheme);
    };
  }, []);

  return null;
}
