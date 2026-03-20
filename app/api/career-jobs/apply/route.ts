import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";
import CareerJobApplication from "@/models/CareerJobApplication";

function isValidEmail(email: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const emailRaw = typeof body.email === "string" ? body.email.trim() : "";
    const email = emailRaw.toLowerCase();
    const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
    const linkedin = typeof body.linkedin === "string" ? body.linkedin.trim() : undefined;
    const coverLetter = typeof body.coverLetter === "string" ? body.coverLetter.trim() : undefined;

    if (!jobId || !fullName || !email) {
      return NextResponse.json({ message: "jobId, fullName and email are required" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    await connectDB();

    const job = await CareerJob.findById(jobId).lean();
    if (!job || !job.published) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    const now = new Date();
    if (job.expirationDateTime && job.expirationDateTime instanceof Date && job.expirationDateTime.getTime() < now.getTime()) {
      return NextResponse.json({ message: "Job is expired" }, { status: 410 });
    }

    const created = await CareerJobApplication.findOneAndUpdate(
      { jobId: job._id, email },
      {
        $set: {
          fullName,
          phone,
          linkedin,
          coverLetter,
          status: "submitted",
          domainSnapshot: job.domain,
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ ok: true, applicationId: created?._id?.toString?.() });
  } catch (error) {
    console.error("POST /api/career-jobs/apply failed:", error);
    return NextResponse.json({ message: "Failed to submit application" }, { status: 500 });
  }
}

