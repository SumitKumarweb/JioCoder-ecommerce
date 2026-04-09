import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hidden jobs board",
  description:
    "Internal reference of tech placement-style openings: company, role, CTC band, and locations. Search and filter listings in one place.",
  keywords: [
    "jiocoder hidden jobs",
    "tech jobs India",
    "developer openings",
    "full stack jobs",
    "frontend engineer India",
  ],
  alternates: {
    canonical: "/hidden-jobs",
  },
  openGraph: {
    title: "Hidden jobs board | JioCoder",
    description:
      "Searchable board of job openings with CTC bands, locations, and roles—reference data for candidates and partners.",
    url: "/hidden-jobs",
    type: "website",
    siteName: "JioCoder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hidden jobs board | JioCoder",
    description:
      "Searchable job reference: companies, roles, CTC ranges, and locations.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function HiddenJobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
