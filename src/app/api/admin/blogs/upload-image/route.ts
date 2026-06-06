import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { uploadFile } from "@/lib/upload";
import { fileService } from "@/modules/files";

export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const titleInput = formData.get("title") as string | null;
    const descriptionInput = formData.get("description") as string | null;

    if (!file) return errorResponse("No file provided", 400);
    if (!file.type.startsWith("image/")) {
      return errorResponse("Only image files are allowed", 400);
    }

    const blob = await uploadFile(file, "blog-images");

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

    return jsonResponse(
      {
        id: fileRecord.id,
        url: fileRecord.url,
      },
      201,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Image upload failed";
    return errorResponse(message, 400);
  }
}