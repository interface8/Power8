import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import {
  adminMerchantBundlesService,
  adminPendingMerchantBundlesFiltersSchema,
} from "@/modules/admin-merchant-bundles";

export async function GET(request: NextRequest) {
  const guard = await requireApiPermissionFor("merchant_bundles", "view_pending");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const parsed = adminPendingMerchantBundlesFiltersSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await adminMerchantBundlesService.listPendingBundles(parsed.data);
  return jsonResponse(result);
}
