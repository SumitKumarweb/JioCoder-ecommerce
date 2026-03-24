import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/seo/getSiteUrl";
import { buildLlmsTxt } from "@/lib/seo/buildLlmsTxt";

export const revalidate = 86400;

export function GET() {
  const body = buildLlmsTxt(getSiteUrl());
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
