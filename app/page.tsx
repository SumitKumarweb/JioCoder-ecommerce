import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import TrendingProducts from "@/components/TrendingProducts";
import BestSellers from "@/components/BestSellers";
import CommunityReviews from "@/components/CommunityReviews";
import InstagramReels from "@/components/InstagramReels";
import ProductSpotlight from "@/components/ProductSpotlight";
import LiveSetupGallery from "@/components/LiveSetupGallery";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import CompareNotification from "@/components/CompareNotification";
import SaleModal from "@/components/SaleModal";
import { MetadataManager } from "@/lib/metadata-manager";
import { BreadcrumbSchema } from "@/components/schemas";

export async function generateMetadata(): Promise<Metadata> {
  const metadataManager = new MetadataManager();
  const pageMetadata = await metadataManager.getPageMetadata('home');

  return {
    title: pageMetadata.metaTitle || "JioCoder - Premium Mechanical Keyboards & Gaming Peripherals",
    description: pageMetadata.metaDescription || 
      "Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables at JioCoder. Shop trending products, best sellers, and authentic gear with fast India-wide shipping.",
    keywords: pageMetadata.metaKeywords?.split(',').map((k: string) => k.trim()) || 
      ["mechanical keyboards", "gaming mice", "keycaps", "custom cables", "gaming peripherals", "India keyboard store"],
    openGraph: {
      title: pageMetadata.ogTitle || pageMetadata.metaTitle || "JioCoder - Premium Mechanical Keyboards & Gaming Peripherals",
      description: pageMetadata.ogDescription || pageMetadata.metaDescription || 
        "Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables. Fast India-wide shipping and authentic products.",
      url: "/",
      images: pageMetadata.ogImage ? [{ url: pageMetadata.ogImage }] : undefined,
    },
    alternates: {
      canonical: pageMetadata.canonicalUrl || "/",
    },
  };
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "JioCoder",
    description: "Premium mechanical keyboards, gaming mice, keycaps, and custom cables",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.jiocoder.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.jiocoder.com"}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BreadcrumbSchema
        items={[
          { label: 'Home', href: '/' },
        ]}
      />
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-4 sm:py-6 space-y-8 sm:space-y-10 md:space-y-12 overflow-x-hidden">
        <Hero />
        <FeaturedCategories />
        <TrendingProducts />
        <BestSellers />
        <CommunityReviews />
        <InstagramReels />
        <ProductSpotlight />
        <LiveSetupGallery />
      </main>
      <Features />
      <Footer />
      <CompareNotification />
      <SaleModal />
    </>
  );
}
