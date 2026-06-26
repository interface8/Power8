import { NextRequest } from "next/server";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantBundleService, updateMerchantBundleSchema } from "@/modules/merchant-bundles";

function mapErr(e: unknown, fallback: string) {
  const msg = e instanceof Error ? e.message : fallback;
  if (msg === "Bundle not found") return errorResponse(msg, 404);
  if (msg === "Forbidden") return errorResponse("You do not own this bundle", 403);
  if (msg.includes("not approved") || msg.includes("don't belong")) return errorResponse(msg, 400);
  return errorResponse(msg, 500);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateMerchantBundleSchema.safeParse(body);
    if (!parsed.success) {
     const first = parsed.error.issues[0]?.message ?? "Validation failed";
      return errorResponse(first, 400);
    }
    const result = await merchantBundleService.updateBundle(auth.merchant.id, id, parsed.data);
    return jsonResponse({
      data: result.bundle,
      requiresReapproval: result.requiresReapproval,
      message: "Bundle updated — it's now pending admin re-approval.",
    });
  } catch (e) {
    return mapErr(e, "Failed to update bundle");
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    const bundle = await merchantBundleService.deleteBundle(auth.merchant.id, id);
    return jsonResponse({ data: bundle, message: "Bundle deactivated." });
  } catch (e) {
    return mapErr(e, "Failed to delete bundle");
  }
}
