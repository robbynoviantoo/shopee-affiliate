import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BackToTopButton } from "@/components/back-to-top-button";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Berlianna's - Shopee Affiliate Finds";
const siteDescription = "Katalog rekomendasi produk Shopee affiliate pilihan Berlianna's dengan pencarian cepat, filter kategori, hot deals, dan link belanja praktis.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "Berlianna Shopee Affiliate",
    "Shopee Affiliate Finds",
    "rekomendasi produk Shopee",
    "link Shopee affiliate",
    "produk Shopee pilihan",
    "hot deals Shopee",
    "katalog affiliate Indonesia",
  ],
  authors: [{ name: "Berlianna" }],
  creator: "Berlianna",
  publisher: "Berlianna",
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/logo.svg",
        width: 900,
        height: 260,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/logo.svg"],
  },
  appleWebApp: {
    capable: true,
    title: "Berlianna's",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon.svg",
    shortcut: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffd93d",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BackToTopButton />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

