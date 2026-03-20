import { mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

/**
 * Saves a status image. Local: public/uploads/community-status. Serverless: tmp + /api/community/status-file URL.
 */
export async function saveCommunityStatusImage(file: File): Promise<{ url: string }> {
  if (!file || file.size <= 0) {
    throw new Error("Choose an image file");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller");
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error("Allowed: JPG, PNG, WebP, or GIF");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = `status-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

  const usePublic =
    process.env.VERCEL !== "1" && process.env.VERCEL !== "true" && !process.env.AWS_LAMBDA_FUNCTION_NAME;
  const tmpDir = path.join(os.tmpdir(), "jiocoder-community-status");
  const uploadDir = usePublic
    ? path.join(process.cwd(), "public", "uploads", "community-status")
    : tmpDir;

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), buffer);

  return {
    url: usePublic
      ? `/uploads/community-status/${safeName}`
      : `/api/community/status-file?name=${encodeURIComponent(safeName)}`,
  };
}
