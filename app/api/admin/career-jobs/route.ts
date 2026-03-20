import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    await connectDB();
    const jobs = await CareerJob.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Admin GET /career-jobs failed:", error);
    return NextResponse.json({ message: "Failed to fetch career jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const domain = typeof body.domain === "string" ? body.domain.trim() : "";
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";

    if (!title || !domain || !companyName) {
      return NextResponse.json({ message: "title, domain, and companyName are required" }, { status: 400 });
    }

    const description = typeof body.description === "string" ? body.description : undefined;
    const problemSolvingRequirement =
      typeof body.problemSolvingRequirement === "string"
        ? body.problemSolvingRequirement
        : undefined;
    const companyEmail = typeof body.companyEmail === "string" ? body.companyEmail.trim() : undefined;
    const location = typeof body.location === "string" ? body.location.trim() : undefined;
    const minCTC = typeof body.minCTC === "number" ? body.minCTC : undefined;
    const maxCTC = typeof body.maxCTC === "number" ? body.maxCTC : undefined;
    const expirationDateTime =
      typeof body.expirationDateTime === "string" || body.expirationDateTime instanceof Date
        ? new Date(body.expirationDateTime)
        : undefined;

    const published = body.published === false ? false : true;
    const slug = toSlug(title);
    if (!slug) {
      return NextResponse.json({ message: "Invalid title for slug generation" }, { status: 400 });
    }

    const existing = await CareerJob.findOne({ slug }).select("_id").lean();
    if (existing) {
      return NextResponse.json(
        { message: "A job with this title already exists. Please use a unique title." },
        { status: 409 }
      );
    }

    const created = await CareerJob.create({
      title,
      slug,
      domain,
      companyName,
      description,
      problemSolvingRequirement,
      companyEmail,
      location,
      minCTC,
      maxCTC,
      expirationDateTime: expirationDateTime && !Number.isNaN(expirationDateTime.getTime()) ? expirationDateTime : undefined,
      published,
    });

    return NextResponse.json({ ...created.toObject(), id: created._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("Admin POST /career-jobs failed:", error);
    return NextResponse.json({ message: "Failed to create career job" }, { status: 500 });
  }
}

