import { NextRequest } from "next/server";
import { isErrorResponse, requireApiPermissionFor } from "@/lib/auth";
import { errorResponse, jsonResponse } from "@/lib/http";
import {
  adminMerchantProductsService,
  adminPendingMerchantProductsFiltersSchema,
} from "@/modules/admin-merchant-products";

export async function GET(request: NextRequest) {
  const guard = await requireApiPermissionFor("merchant_products", "view_pending");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const parsed = adminPendingMerchantProductsFiltersSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await adminMerchantProductsService.listPendingProducts(parsed.data);
  return jsonResponse(result);
}
