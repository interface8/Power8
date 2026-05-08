import { put, del } from "@vercel/blob";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface BlobUploadResult {
  url: string;
  pathname: string;
}

export function validateFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: JPG, PNG, WEBP, PDF");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Max size is 5MB");
  }
}

export async function uploadFile(
  file: File,
  folder: string = "uploads",
): Promise<BlobUploadResult> {
  validateFile(file);

  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
  const pathname = `${folder}/${uniqueName}`;

  const blob = await put(pathname, file, { access: "public" });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}

export async function deleteFile(pathname: string): Promise<void> {
  await del(pathname);
}
