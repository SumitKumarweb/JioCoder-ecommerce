import type { Metadata } from "next";
import Navbar from '@/components/Navbar';
import CompareHeader from '@/components/CompareHeader';
import CompareTable from '@/components/CompareTable';
import CompareFeatures from '@/components/CompareFeatures';
import Footer from '@/components/Footer';
import { BreadcrumbItem } from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare mechanical keyboards, gaming mice, and peripherals side-by-side. View detailed specifications, prices, features, and make informed purchasing decisions.",
  keywords: ["compare keyboards", "keyboard comparison", "product comparison", "mechanical keyboard specs", "gaming mouse comparison"],
  openGraph: {
    title: "Compare Products - JioCoder",
    description: "Compare mechanical keyboards, gaming mice, and peripherals side-by-side with detailed specifications.",
    url: "/compare",
  },
  alternates: {
    canonical: "/compare",
  },
};

export default function ComparePage() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Comparison' },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Products - JioCoder",
    description: "Compare mechanical keyboards, gaming mice, and peripherals side-by-side",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/compare`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Comparison",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-6">
        <CompareHeader
          title="Compare Products"
          description="Compare specifications and features of your selected products."
          breadcrumbItems={breadcrumbItems}
        />
        <CompareTable />
        <CompareFeatures />
      </main>
      <Footer />
    </>
  );
}

