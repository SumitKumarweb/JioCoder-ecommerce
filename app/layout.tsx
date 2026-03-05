import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { CompareProvider } from "@/contexts/CompareContext";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import ResetPasswordHandler from "@/components/ResetPasswordHandler";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JioCoder - Premium Mechanical Keyboards & Gaming Peripherals",
    template: "%s | JioCoder",
  },
  description: "Shop premium mechanical keyboards, gaming mice, keycaps, and custom cables. Fast India-wide shipping, authentic products, and expert support for your perfect setup.",
  keywords: ["mechanical keyboards", "gaming peripherals", "keycaps", "gaming mice", "custom cables", "India", "keyboard accessories"],
  authors: [{ name: "JioCoder" }],
  creator: "JioCoder",
  publisher: "JioCoder",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "JioCoder",
    title: "JioCoder - Premium Mechanical Keyboards & Gaming Peripherals",
    description: "Shop premium mechanical keyboards, gaming mice, keycaps, and custom cables. Fast India-wide shipping, authentic products, and expert support.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JioCoder - Premium Mechanical Keyboards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JioCoder - Premium Mechanical Keyboards & Gaming Peripherals",
    description: "Shop premium mechanical keyboards, gaming mice, keycaps, and custom cables.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-w-0 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <CompareProvider>
          <CartProvider>
        {children}
            <CartDrawer />
            <Suspense fallback={null}>
              <ResetPasswordHandler />
            </Suspense>
          </CartProvider>
        </CompareProvider>
        <Analytics />
      </body>
    </html>
  );
}
