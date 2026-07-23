import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function GET() {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const link = `${baseUrl}/store/${auth.merchant.id}`;
    return jsonResponse({ data: { link } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate link";
    return errorResponse(message, 500);
  }
}