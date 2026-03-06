import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import { CompareProvider } from "@/contexts/CompareContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import CartDrawer from "@/components/CartDrawer";
import ResetPasswordHandler from "@/components/ResetPasswordHandler";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.jiocoder.com"),
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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PS8WG9JF');`,
          }}
        />
        {/* End Google Tag Manager */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-w-0 overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PS8WG9JF"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <CompareProvider>
          <CartProvider>
            <WishlistProvider>
        {children}
                <CartDrawer />
                <Suspense fallback={null}>
                  <ResetPasswordHandler />
                </Suspense>
            </WishlistProvider>
          </CartProvider>
        </CompareProvider>
      </body>
    </html>
  );
}
