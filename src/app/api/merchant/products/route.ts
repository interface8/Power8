import { NextRequest } from "next/server";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantProductService, createMerchantProductSchema, listMerchantProductsSchema } from "@/modules/merchant-products";

export async function GET(request: NextRequest) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const parsed = listMerchantProductsSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const data = await merchantProductService.listProducts(auth.merchant.id, parsed.data);
  return jsonResponse(data);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const parsed = createMerchantProductSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Validation failed";
      return errorResponse(first, 400);
    }
    const product = await merchantProductService.createProduct(auth.merchant.id, parsed.data);
    return jsonResponse({ data: product }, 201);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create product";
    if (msg === "Category not found") return errorResponse(msg, 400);
    return errorResponse(msg, 500);
  }
}
