import { NextRequest } from "next/server";
import { fileService, updateFileSchema } from "@/modules/files";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/files/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const file = await fileService.getFileById(id);
    return jsonResponse({ data: file });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "File not found") {
      return errorResponse("File not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}

// PATCH /api/files/:id — update title/description
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateFileSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const file = await fileService.updateFile(id, {
      ...parsed.data,
      modifiedById: guard.id,
    });
    return jsonResponse({ data: file });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "File not found") {
      return errorResponse("File not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}

// DELETE /api/files/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const result = await fileService.deleteFile(id);
    return jsonResponse(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "File not found") {
      return errorResponse("File not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
