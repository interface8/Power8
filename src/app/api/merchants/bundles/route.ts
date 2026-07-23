import { NextRequest } from "next/server";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantBundleService, createMerchantBundleSchema } from "@/modules/merchant-bundles";

export async function GET() {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;
  const data = await merchantBundleService.listBundles(auth.merchant.id);
  return jsonResponse({ data });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const parsed = createMerchantBundleSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Validation failed";
      return errorResponse(first, 400);
    }
    const bundle = await merchantBundleService.createBundle(auth.merchant.id, parsed.data);
    return jsonResponse({ data: bundle }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create bundle";
    if (msg.includes("not approved") || msg.includes("don't belong")) return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}
