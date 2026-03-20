import type { Metadata } from "next";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";
import CareerJobsClient from "./CareerJobsClient";

export const metadata: Metadata = {
  title: "Careers - JioCoder",
  alternates: {
    canonical: "/careers",
  },
};

function toSlug(input: string) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function CareersPage() {
  await connectDB();

  const now = new Date();
  const jobs = await CareerJob.find({
    published: true,
    $or: [{ expirationDateTime: { $exists: false } }, { expirationDateTime: { $gt: now } }],
  })
    .sort({ createdAt: -1 })
    .select("title slug domain companyName description location minCTC maxCTC expirationDateTime published")
    .lean();

  const mapped = (jobs || []).map((j: any) => ({
    id: j._id?.toString?.() || String(j._id),
    slug: j.slug || toSlug(j.title),
    title: j.title,
    domain: j.domain,
    companyName: j.companyName,
    description: j.description || "",
    location: j.location || "",
    minCTC: j.minCTC ?? null,
    maxCTC: j.maxCTC ?? null,
    expirationDateTime: j.expirationDateTime ? new Date(j.expirationDateTime).toISOString() : null,
    published: Boolean(j.published),
  }));

  return <CareerJobsClient jobs={mapped} />;
}

