import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers - JioCoder",
  alternates: {
    canonical: "/careers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}

