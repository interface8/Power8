import { requireApiMerchant, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantDashboardService } from "@/modules/merchant-dashboard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  try {
    const { orderId } = await params;
    const data = await merchantDashboardService.getOrderById(auth.merchant.id, orderId);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch merchant order";
    if (message === "Order not found") return errorResponse("Order not found", 404);
    return errorResponse(message, 500);
  }
}
