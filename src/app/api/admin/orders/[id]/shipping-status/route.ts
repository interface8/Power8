import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import {
  adminOrdersService,
  adminUpdateOrderShippingStatusSchema,
} from "@/modules/admin-orders";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  const body = await request.json();
  const parsed = adminUpdateOrderShippingStatusSchema.safeParse(body);
  if (!parsed.success) return errorResponse("Invalid shipping status payload", 400);

  try {
    const updated = await adminOrdersService.updateOrderShippingStatus({
      orderId: params.id,
      adminId: guard.id,
      status: parsed.data.status,
      trackingNumber: parsed.data.trackingNumber,
      shippingProvider: parsed.data.shippingProvider,
    });

    return jsonResponse({ data: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to update shipping status";
    if (msg === "Order not found") return errorResponse(msg, 404);
    if (msg.startsWith("Invalid shipping status transition")) return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}