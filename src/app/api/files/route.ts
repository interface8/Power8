import { fileService } from "@/modules/files";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/files — list current user's files
export async function GET() {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const files = await fileService.listFiles(guard.id);
    return jsonResponse({ data: files });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch files";
    return errorResponse(message, 500);
  }
}
