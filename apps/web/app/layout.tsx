import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbrains" });

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm", weight: ["400", "500", "600", "700", "800"] });

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  themeColor: "#1B3A6B",
}

export const metadata: Metadata = {
  title: "ReportWise",
  description: "School report card and score management system",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReportWise",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(jetbrainsMono.variable, dmSans.variable, geistSans.variable, geistMono.variable)}>
      <body
        className="antialiased scroll-smooth"
      >
        {children}
      </body>
    </html>
  );
}
