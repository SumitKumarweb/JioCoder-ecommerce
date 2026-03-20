import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";
import CareerJobApplyForm from "../CareerJobApplyForm";

function toSlug(input: string) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function CareerJobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connectDB();
  const { slug } = await params;

  let job = await CareerJob.findOne({ slug, published: true }).lean();

  // Backward-compatible fallback for older rows without slug
  if (!job) {
    const candidates = await CareerJob.find({ published: true }).lean();
    const byTitle = (candidates || []).find((j: any) => toSlug(j.title) === slug);
    if (byTitle) {
      job = byTitle;
      if (!byTitle.slug) {
        await CareerJob.findByIdAndUpdate(byTitle._id, { $set: { slug } });
      }
    }
  }

  if (!job || !job.published) {
    notFound();
  }

  const requirement =
    job.problemSolvingRequirement?.trim() ||
    "Share one real problem you solved in your domain, your approach, trade-offs, and result.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
          <p className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            {job.domain}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">{job.title}</h1>
          <p className="text-slate-600 mt-2">{job.companyName}</p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-xs text-slate-500">CTC</div>
              <div className="font-bold text-slate-900">
                {job.minCTC != null || job.maxCTC != null
                  ? `${job.minCTC ?? "-"}L - ${job.maxCTC ?? "-"}L`
                  : "Not specified"}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Location</div>
              <div className="font-bold text-slate-900">{job.location || "Remote / Flexible"}</div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Last date</div>
              <div className="font-bold text-slate-900">
                {job.expirationDateTime
                  ? new Date(job.expirationDateTime).toLocaleDateString()
                  : "No expiry"}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">Role Details</h2>
            <p className="text-slate-700 whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-slate-900 text-white p-4">
            <h3 className="font-bold mb-1">Problem-Solving Requirement</h3>
            <p className="text-sm text-slate-200">{requirement}</p>
          </div>
        </div>

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-black text-slate-900 mb-4">Apply Now</h3>
          <CareerJobApplyForm jobId={String(job._id)} defaultDomain={job.domain} />
        </div>
      </div>
    </div>
  );
}

