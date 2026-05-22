import { adminOrdersService } from "@/modules/admin-orders";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const order = await adminOrdersService.getOrderDetailsById(params.id);
    return jsonResponse({ data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    const status = message === "Order not found" ? 404 : 500;
    return errorResponse(message, status);
  }
}