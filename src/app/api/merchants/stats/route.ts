import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantDashboardService } from "@/modules/merchant-dashboard";

export async function GET() {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  try {
    const data = await merchantDashboardService.getDashboardStats(auth.merchant.id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch merchant stats";
    return errorResponse(message, 500);
  }
}
