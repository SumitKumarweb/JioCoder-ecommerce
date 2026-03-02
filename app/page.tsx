import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCategories from "@/components/FeaturedCategories";
import TrendingProducts from "@/components/TrendingProducts";
import BestSellers from "@/components/BestSellers";
import CommunityReviews from "@/components/CommunityReviews";
import ProductSpotlight from "@/components/ProductSpotlight";
import LiveSetupGallery from "@/components/LiveSetupGallery";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import CompareNotification from "@/components/CompareNotification";
import SaleModal from "@/components/SaleModal";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables at JioCoder. Shop trending products, best sellers, and authentic gear with fast India-wide shipping.",
  keywords: ["mechanical keyboards", "gaming mice", "keycaps", "custom cables", "gaming peripherals", "India keyboard store"],
  openGraph: {
    title: "JioCoder - Premium Mechanical Keyboards & Gaming Peripherals",
    description: "Discover premium mechanical keyboards, gaming mice, keycaps, and custom cables. Fast India-wide shipping and authentic products.",
    url: "/",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "JioCoder",
    description: "Premium mechanical keyboards, gaming mice, keycaps, and custom cables",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.png`,
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
      <Navbar />
      <main className="max-w-[1440px] mx-auto w-full min-w-0 px-3 sm:px-4 md:px-10 lg:px-20 py-4 sm:py-6 space-y-8 sm:space-y-10 md:space-y-12 overflow-x-hidden">
        <Hero />
        <FeaturedCategories />
        <TrendingProducts />
        <BestSellers />
        <CommunityReviews />
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
