import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import { jsonResponse, errorResponse } from "@/lib/http";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Public upload endpoint for merchant registration documents.
 * No authentication required — only used during the registration flow.
 * Stricter limits and a dedicated folder.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const purpose = (formData.get("purpose") as string) || "registration";

    if (!file) return errorResponse("No file provided", 400);

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(
        "Invalid file type. Allowed: JPG, PNG, WEBP, PDF",
        400,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return errorResponse("File too large. Maximum size is 5MB", 400);
    }

    const safePurpose = purpose.replace(/[^a-z0-9-]/gi, "").slice(0, 30);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
    const pathname = `registration/${safePurpose}/${uniqueName}`;

    const blob = await put(pathname, file, { access: "public" });

    return jsonResponse({ url: blob.url }, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return errorResponse(message, 500);
  }
}
