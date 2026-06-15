import { adminOrdersService } from "@/modules/admin-orders";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireApiPermissionFor("orders", "view_detail");
  if (isErrorResponse(guard)) return guard;

  try {
    const order = await adminOrdersService.getOrderDetailsById(params.id);
    return jsonResponse({ data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    const status = message === "Order not found" ? 404 : 500;
    return errorResponse(message, status);
  }
}