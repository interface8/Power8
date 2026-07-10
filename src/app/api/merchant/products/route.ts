import { NextRequest } from "next/server";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantProductService, createMerchantProductSchema, listMerchantProductsSchema } from "@/modules/merchant-products";

export async function GET(request: NextRequest) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams);
  if (!query.approvalStatus && typeof query.status === "string") {
    query.approvalStatus = query.status.toUpperCase();
  }

  const parsed = listMerchantProductsSchema.safeParse(query);
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await merchantProductService.listProducts(auth.merchant.id, parsed.data);

  const data = result.data.map((product) => ({
    ...product,
    status: product.approvalStatus,
    categoryName: product.category?.name ?? "Uncategorized",
    primaryImage: product.images[0] ?? null,
  }));

  return jsonResponse({ data, pagination: result.pagination });
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
