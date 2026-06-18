import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { bundleService, createBundleSchema } from "@/modules/bundles";

export async function GET() {
  const guard = await requireApiPermissionFor("bundles", "view");
  if (isErrorResponse(guard)) return guard;

  try {
    const bundles = await bundleService.listBundles();
    return jsonResponse({ data: bundles });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch bundles";
    return errorResponse(msg, 500);
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireApiPermissionFor("bundles", "create");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createBundleSchema.safeParse(body);
    if (!parsed.success) return errorResponse("Validation failed", 400);

    const bundle = await bundleService.createBundle(parsed.data);
    return jsonResponse({ data: bundle }, 201);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "Bundle already exists") {
      return errorResponse("Bundle already exists", 409);
    }
    const msg = e instanceof Error ? e.message : "Failed to create bundle";
    return errorResponse(msg, 500);
  }
}