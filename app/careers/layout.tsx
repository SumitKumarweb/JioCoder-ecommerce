import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the JioCoder team. Explore open roles in engineering, marketing, design, and operations. Work on India's leading mechanical keyboard and gaming peripherals platform.",
  keywords: [
    "jiocoder jobs",
    "tech jobs India",
    "gaming industry careers",
    "e-commerce jobs India",
    "software engineer jobs India",
    "startup jobs India",
  ],
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at JioCoder",
    description:
      "Explore open roles and join the team behind India's leading mechanical keyboard and gaming peripherals platform.",
    url: "/careers",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Careers at JioCoder",
    description: "Explore open roles and join the JioCoder team.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

