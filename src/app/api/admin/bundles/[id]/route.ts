import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { bundleService, updateBundleSchema } from "@/modules/bundles";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const { id } = await params;
    const bundle = await bundleService.getBundleById(id);
    return jsonResponse({ data: bundle });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Bundle not found") {
      return errorResponse("Bundle not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to fetch bundle";
    return errorResponse(msg, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBundleSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Validation failed", 400);

    const bundle = await bundleService.updateBundle(id, parsed.data);
    return jsonResponse({ data: bundle });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Bundle not found") {
      return errorResponse("Bundle not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to update bundle";
    return errorResponse(msg, 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const { id } = await params;
    await bundleService.deleteBundle(id);
    return jsonResponse({ message: "Bundle deleted successfully" });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Bundle not found") {
      return errorResponse("Bundle not found", 404);
    }
    const msg = e instanceof Error ? e.message : "Failed to delete bundle";
    return errorResponse(msg, 500);
  }
}