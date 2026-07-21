import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { bundleService, updateBundleSchema } from "@/modules/bundles";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("bundles", "view");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const bundle = await bundleService.getBundleById(id);
    return jsonResponse({ data: bundle });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch bundle";
    if (msg === "Bundle not found") return errorResponse(msg, 404);
    return errorResponse(msg, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("bundles", "edit");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBundleSchema.safeParse(body);
    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return errorResponse(firstError, 400);
    }
    const bundle = await bundleService.updateBundle(id, parsed.data);
    return jsonResponse({ data: bundle });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update bundle";
    if (msg === "Bundle not found") return errorResponse(msg, 404);
    return errorResponse(msg, 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("bundles", "delete");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    await bundleService.deleteBundle(id);
    return jsonResponse({ message: "Bundle deleted successfully" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to delete bundle";
    if (msg === "Bundle not found") return errorResponse(msg, 404);
    return errorResponse(msg, 500);
  }
}