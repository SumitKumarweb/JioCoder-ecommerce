import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CareerJob from "@/models/CareerJob";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;
    const job = await CareerJob.findById(id).lean();
    if (!job) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(job);
  } catch (error) {
    console.error("Admin GET /career-jobs/[id] failed:", error);
    return NextResponse.json({ message: "Failed to fetch career job" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { id } = await params;

    const update: Record<string, any> = {};
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const domain = typeof body.domain === "string" ? body.domain.trim() : "";
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";

    if (title) update.title = title;
    if (domain) update.domain = domain;
    if (companyName) update.companyName = companyName;

    if (typeof body.description === "string") update.description = body.description;
    if (typeof body.companyEmail === "string") update.companyEmail = body.companyEmail.trim();
    if (typeof body.location === "string") update.location = body.location.trim();

    if (typeof body.minCTC === "number") update.minCTC = body.minCTC;
    if (typeof body.maxCTC === "number") update.maxCTC = body.maxCTC;

    if (body.expirationDateTime) {
      const d = new Date(body.expirationDateTime);
      if (!Number.isNaN(d.getTime())) update.expirationDateTime = d;
    }

    if (typeof body.published === "boolean") update.published = body.published;

    const updated = await CareerJob.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ ...updated, id: (updated as any)._id?.toString?.() });
  } catch (error) {
    console.error("Admin PUT /career-jobs/[id] failed:", error);
    return NextResponse.json({ message: "Failed to update career job" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;
    await CareerJob.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin DELETE /career-jobs/[id] failed:", error);
    return NextResponse.json({ message: "Failed to delete career job" }, { status: 500 });
  }
}

