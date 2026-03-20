import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";
import CareerJobsClient from "./CareerJobsClient";

export default async function CareersPage() {
  await connectDB();

  const now = new Date();
  const jobs = await CareerJob.find({
    published: true,
    $or: [{ expirationDateTime: { $exists: false } }, { expirationDateTime: { $gt: now } }],
  })
    .sort({ createdAt: -1 })
    .select("title domain companyName description location minCTC maxCTC expirationDateTime published")
    .lean();

  const mapped = (jobs || []).map((j: any) => ({
    id: j._id?.toString?.() || String(j._id),
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

