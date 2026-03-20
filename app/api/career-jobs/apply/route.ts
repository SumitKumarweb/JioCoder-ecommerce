import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";
import CareerJobApplication from "@/models/CareerJobApplication";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function isValidEmail(email: string) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

async function saveResume(file: File): Promise<{ url: string; fileName: string } | null> {
  if (!file || !file.name) return null;
  const maxBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size <= 0 || file.size > maxBytes) {
    throw new Error("Resume must be between 1 byte and 5MB");
  }

  const ext = path.extname(file.name).toLowerCase();
  const allowed = new Set([".pdf", ".doc", ".docx"]);
  if (!allowed.has(ext)) {
    throw new Error("Only PDF/DOC/DOCX resume files are allowed");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = `resume-${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), buffer);

  return {
    url: `/uploads/resumes/${safeName}`,
    fileName: file.name,
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let jobId = "";
    let fullName = "";
    let email = "";
    let phone: string | undefined;
    let linkedin: string | undefined;
    let coverLetter: string | undefined;
    let resumeUrl: string | undefined;
    let resumeFileName: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      jobId = String(form.get("jobId") || "").trim();
      fullName = String(form.get("fullName") || "").trim();
      email = String(form.get("email") || "").trim().toLowerCase();
      phone = String(form.get("phone") || "").trim() || undefined;
      linkedin = String(form.get("linkedin") || "").trim() || undefined;
      coverLetter = String(form.get("coverLetter") || "").trim() || undefined;

      const resume = form.get("resume");
      if (resume && typeof resume !== "string") {
        const saved = await saveResume(resume);
        resumeUrl = saved?.url;
        resumeFileName = saved?.fileName;
      }
    } else {
      const body = await req.json().catch(() => ({}));
      jobId = typeof body.jobId === "string" ? body.jobId.trim() : "";
      fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
      email = (typeof body.email === "string" ? body.email.trim() : "").toLowerCase();
      phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
      linkedin = typeof body.linkedin === "string" ? body.linkedin.trim() : undefined;
      coverLetter = typeof body.coverLetter === "string" ? body.coverLetter.trim() : undefined;
      resumeUrl = typeof body.resumeUrl === "string" ? body.resumeUrl.trim() : undefined;
      resumeFileName = typeof body.resumeFileName === "string" ? body.resumeFileName.trim() : undefined;
    }

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
          resumeUrl,
          resumeFileName,
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

