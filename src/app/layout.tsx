import type { Metadata } from "next";
import { DemoThemeSync } from "@/components/demo-theme-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lux Remodeling",
  description:
    "Marketing site and lead management workspace for a home remodeling business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <DemoThemeSync />
        {children}
      </body>
    </html>
  );
}
