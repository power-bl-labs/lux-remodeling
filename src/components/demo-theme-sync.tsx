"use client";

import { useEffect } from "react";
import { applyThemeToDocument, getDemoTheme } from "@/lib/demo-store";

export function DemoThemeSync() {
  useEffect(() => {
    applyThemeToDocument(getDemoTheme());

    function syncTheme() {
      applyThemeToDocument(getDemoTheme());
    }

    window.addEventListener("storage", syncTheme);
    window.addEventListener("lux-demo-theme-updated", syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("lux-demo-theme-updated", syncTheme);
    };
  }, []);

  return null;
}
