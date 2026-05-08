import { NextRequest } from "next/server";
import { bundleService, updateBundleSchema } from "@/modules/bundles";
import { requireApiPermission, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/bundles/:id — public
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bundle = await bundleService.getBundleById(id);
    return jsonResponse({ data: bundle });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Bundle not found") {
      return errorResponse("Bundle not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}

// PUT /api/bundles/:id — admin
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermission("bundles.update");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBundleSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const bundle = await bundleService.updateBundle(id, parsed.data);
    return jsonResponse({ data: bundle });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Bundle not found") {
      return errorResponse("Bundle not found", 404);
    }
    return errorResponse("Internal server error", 500);
  }
}
