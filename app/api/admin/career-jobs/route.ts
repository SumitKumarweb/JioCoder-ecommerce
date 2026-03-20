import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";

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
    const companyEmail = typeof body.companyEmail === "string" ? body.companyEmail.trim() : undefined;
    const location = typeof body.location === "string" ? body.location.trim() : undefined;
    const minCTC = typeof body.minCTC === "number" ? body.minCTC : undefined;
    const maxCTC = typeof body.maxCTC === "number" ? body.maxCTC : undefined;
    const expirationDateTime =
      typeof body.expirationDateTime === "string" || body.expirationDateTime instanceof Date
        ? new Date(body.expirationDateTime)
        : undefined;

    const published = body.published === false ? false : true;

    const created = await CareerJob.create({
      title,
      domain,
      companyName,
      description,
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

