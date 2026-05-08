import { NextRequest } from "next/server";
import { uploadFile } from "@/lib/upload";
import { fileService } from "@/modules/files";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// POST /api/upload — upload a file, save File record, return URL
export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const titleInput = formData.get("title") as string | null;
    const descriptionInput = formData.get("description") as string | null;

    if (!file) {
      return errorResponse("No file provided", 400);
    }

    // 1. Upload to Vercel Blob
    const blob = await uploadFile(file, folder);

    // 2. Save File record in DB
    const fileRecord = await fileService.createFile({
      title: titleInput || file.name,
      description: descriptionInput || undefined,
      type: file.type,
      size: file.size,
      url: blob.url,
      pathname: blob.pathname,
      userId: guard.id,
      createdById: guard.id,
    });

    // 3. Return URL + file record id
    return jsonResponse(
      {
        id: fileRecord.id,
        url: fileRecord.url,
      },
      201,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return errorResponse(message, 400);
  }
}
