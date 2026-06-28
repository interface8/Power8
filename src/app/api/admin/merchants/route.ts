import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import { adminMerchantsService, adminMerchantListFiltersSchema } from "@/modules/admin-merchants";

export async function GET(request: NextRequest) {
  const guard = await requireApiPermissionFor("merchants", "view_list");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const parsed = adminMerchantListFiltersSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await adminMerchantsService.listMerchants(parsed.data);
  return jsonResponse(result);
}
