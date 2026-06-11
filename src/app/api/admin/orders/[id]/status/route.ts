import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminUpdateOrderStatusSchema } from "@/modules/admin-orders";
import { adminOrdersService } from "@/modules/admin-orders";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireApiPermissionFor("orders", "update_status");
  if (isErrorResponse(guard)) return guard;

  const body = await request.json();
  const parsed = adminUpdateOrderStatusSchema.safeParse(body);
  if (!parsed.success) return errorResponse("Invalid status payload", 400);

  try {
    const updated = await adminOrdersService.updateOrderStatus({
      orderId: params.id,
      adminId: guard.id,
      status: parsed.data.status,
    });

    return jsonResponse({ data: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update order status";
    if (msg === "Order not found") return errorResponse(msg, 404);
    if (msg.startsWith("Invalid status transition")) return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}