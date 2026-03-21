import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { CompareProvider } from "@/contexts/CompareContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import CartDrawer from "@/components/CartDrawer";
import ResetPasswordHandler from "@/components/ResetPasswordHandler";
import { OrganizationSchema, WebSiteSchema } from "@/components/schemas";
import { buildSiteVerification } from "@/lib/seo/siteVerification";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jiocoder.com";

const siteVerification = buildSiteVerification();

const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "JioCoder",
  title: {
    default: "JioCoder — Mechanical Keyboards, Gaming Gear & Learn to Code",
    template: "%s | JioCoder",
  },
  description:
    "Shop mechanical keyboards, gaming mice, keycaps, cables, and JioCoder Studio custom desk mats with India-wide shipping. Plus free /code tracks: JavaScript, Python, Java, C, C++, C#, and web dev — editor, Run, and terminal.",
  keywords: [
    "mechanical keyboards India",
    "gaming keyboards",
    "gaming mice",
    "keycaps",
    "custom cables",
    "desk mat",
    "custom mouse pad India",
    "JioCoder Studio",
    "gaming peripherals",
    "buy keyboard online India",
    "learn JavaScript free",
    "learn Python India",
    "online code playground",
    "free coding tutorial",
    "HTML CSS JavaScript course",
  ],
  category: "ecommerce",
  authors: [{ name: "JioCoder", url: siteUrl.replace(/\/$/, "") }],
  creator: "JioCoder",
  publisher: "JioCoder",
  manifest: "/site.webmanifest",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
  },
  ...(siteVerification ? { verification: siteVerification } : {}),
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US", "en"],
    siteName: "JioCoder",
    title: "JioCoder — Mechanical Keyboards, Gaming Gear & Learn to Code",
    description:
      "Premium keyboards, mice, keycaps, and custom desk mats shipped across India. Free coding playground for JavaScript, Python, Java, C, C++, C#, and web.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JioCoder — mechanical keyboards, gaming peripherals, and free learn-to-code playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JioCoder — Keyboards, Gaming Peripherals & Free /code",
    description:
      "Shop gaming gear in India + free learn-to-code tracks with a live playground.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    title: "JioCoder",
    statusBarStyle: "black-translucent",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
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

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const canonicalPath = h.get("x-canonical-path") || "/";

  return {
    ...baseMetadata,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-IN": canonicalPath,
        "x-default": canonicalPath,
      },
    },
    openGraph: {
      ...(baseMetadata.openGraph || {}),
      url: canonicalPath,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
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
        {/* Microsoft Clarity — https://clarity.microsoft.com/ */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "vze516x1c0");`,
          }}
        />
        {/* Preconnect so the font DNS + TLS handshake happens early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Material Symbols — loaded synchronously so icons never flash as text */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://lh3.googleusercontent.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://img.youtube.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="anonymous" />
        <OrganizationSchema />
        <WebSiteSchema />
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
