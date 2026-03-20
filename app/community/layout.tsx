import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Coder Community",
  description:
    "Share posts, join coding groups, chat, and set a 24-hour status. Connect with other developers on JioCoder.",
  alternates: { canonical: "/community" },
  robots: { index: true, follow: true },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="relative pt-20 min-h-screen overflow-hidden bg-[#f8f7fc] text-slate-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(139,92,246,0.18),transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(236,72,153,0.1),transparent),radial-gradient(ellipse_50%_40%_at_0%_100%,rgba(99,102,241,0.12),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]"
        />
        <div className="relative z-10">{children}</div>
      </div>
      <Footer />
    </>
  );
}
