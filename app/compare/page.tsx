import type { Metadata } from "next";
import Navbar from '@/components/Navbar';
import CompareHeader from '@/components/CompareHeader';
import CompareTable from '@/components/CompareTable';
import CompareFeatures from '@/components/CompareFeatures';
import Footer from '@/components/Footer';
import { BreadcrumbItem } from '@/components/Breadcrumb';
import { WebPageSchema, BreadcrumbSchema } from '@/components/schemas';

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

  return (
    <>
      <WebPageSchema
        path="/compare"
        name="Compare Products - JioCoder"
        description="Compare mechanical keyboards, gaming mice, and peripherals side-by-side with detailed specifications."
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-6">
        <h1 className="sr-only">Compare JioCoder products</h1>
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

