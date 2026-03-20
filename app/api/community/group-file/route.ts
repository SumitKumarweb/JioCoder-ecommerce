import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import os from "os";
import path from "path";

const SAFE_NAME = /^group-\d+-[a-z0-9]+\.(jpg|jpeg|png|webp|gif)$/i;

function imageContentType(ext: string) {
  const e = ext.toLowerCase();
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  return "application/octet-stream";
}

/** Serves group avatars stored under tmp on serverless (Vercel). */
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") || "";
  const base = path.basename(name);
  if (!SAFE_NAME.test(base)) {
    return NextResponse.json({ message: "Invalid file" }, { status: 400 });
  }

  const dir = path.resolve(path.join(os.tmpdir(), "jiocoder-community-group"));
  const full = path.resolve(dir, base);
  if (!full.startsWith(dir + path.sep) && full !== dir) {
    return NextResponse.json({ message: "Invalid path" }, { status: 400 });
  }

  try {
    const buf = await readFile(full);
    const ext = path.extname(base);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": imageContentType(ext),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}
