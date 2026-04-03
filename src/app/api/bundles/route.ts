import { NextRequest } from "next/server";
import { bundleService, createBundleSchema } from "@/modules/bundles";
import { requireApiPermission, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/bundles — public
export async function GET() {
  try {
    const bundles = await bundleService.listBundles();
    return jsonResponse({ data: bundles });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch bundles";
    return errorResponse(message, 500);
  }
}

// POST /api/bundles — admin
export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("bundles.create");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createBundleSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const bundle = await bundleService.createBundle(parsed.data);
    return jsonResponse(bundle, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Bundle already exists") {
      return errorResponse("Bundle already exists", 409);
    }
    const message =
      error instanceof Error ? error.message : "Failed to create bundle";
    return errorResponse(message, 500);
  }
}
