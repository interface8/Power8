import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import {
  adminOrdersService,
  adminUpdateOrderPaymentStatusSchema,
} from "@/modules/admin-orders";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  const body = await request.json();
  const parsed = adminUpdateOrderPaymentStatusSchema.safeParse(body);
  if (!parsed.success)
    return errorResponse("Invalid payment status payload", 400);

  try {
    const updated = await adminOrdersService.updateOrderPaymentStatus({
      orderId: params.id,
      adminId: guard.id,
      status: parsed.data.status,
    });
    return jsonResponse({ data: updated });
  } catch (e: unknown) {
    const msg =
      e instanceof Error ? e.message : "Failed to update payment status";
    if (msg === "Order not found") return errorResponse(msg, 404);
    if (msg.startsWith("Invalid payment status transition"))
      return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}
