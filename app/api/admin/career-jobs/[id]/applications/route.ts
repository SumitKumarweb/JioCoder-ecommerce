import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CareerJobApplication from "@/models/CareerJobApplication";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: jobId } = await params;

    const applications = await CareerJobApplication.find({ jobId })
      .sort({ createdAt: -1 })
      .select("fullName email phone linkedin coverLetter resumeUrl resumeFileName status domainSnapshot createdAt")
      .lean();

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Admin GET /career-jobs/[id]/applications failed:", error);
    return NextResponse.json({ message: "Failed to fetch applications" }, { status: 500 });
  }
}

