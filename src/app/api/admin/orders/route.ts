import { adminOrdersService, adminOrderListFiltersSchema } from "@/modules/admin-orders";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function GET(request: Request) {
  const guard = await requireApiPermissionFor("orders", "view_list");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const parsed = adminOrderListFiltersSchema.safeParse(Object.fromEntries(searchParams));

  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await adminOrdersService.listOrders(parsed.data);
  return jsonResponse(result);
}